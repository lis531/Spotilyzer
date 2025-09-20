// Spotify OAuth configuration
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email', 
  'user-top-read',
  'user-read-recently-played',
  'user-library-read',
  'playlist-modify-public',
  'playlist-modify-private'
].join(' ');

const CACHE_DURATION = 10 * 60 * 1000;
const CACHE_PREFIX = 'spotify_cache_';

function getCacheKey(endpoint: string, params: Record<string, unknown> = {}): string {
  const paramString = Object.keys(params).length ? `_${JSON.stringify(params)}` : '';
  return `${CACHE_PREFIX}${endpoint}${paramString}`;
}

function getCachedData(cacheKey: string): unknown | null {
  if (typeof window === 'undefined') return null;

  const cached = localStorage.getItem(cacheKey);
  if (!cached) return null;
  
  const { data, timestamp } = JSON.parse(cached);
  
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(cacheKey);
    return null;
  }
  
  return data;
}

function setCachedData(cacheKey: string, data: unknown): void {
  if (typeof window === 'undefined') return;
  
  const cacheData = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(cacheKey, JSON.stringify(cacheData));
}

export function clearSpotifyCache(): void {
  if (typeof window === 'undefined') return;
  
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

// Token management
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('spotify_access_token');
  const expiresAt = localStorage.getItem('spotify_token_expires_at');
  
  if (!token || !expiresAt) return false;
  
  return Date.now() < parseInt(expiresAt);
}

export function getAccessToken(): string | null {
  if (!isAuthenticated()) return null;
  return localStorage.getItem('spotify_access_token');
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_token_expires_at');
  localStorage.removeItem('spotify_auth_state');
  localStorage.removeItem('spotify_user_info');
  clearSpotifyCache();
}

// Auth flow
export function getSpotifyAuthUrl(): string {
  const state = Math.random().toString(36).substring(2, 15);
  localStorage.setItem('spotify_auth_state', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
    scope: SPOTIFY_SCOPES,
    redirect_uri: window.location.origin + '/',
    state: state,
    show_dialog: 'true'
  });

  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

export async function handleSpotifyCallback(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const error = urlParams.get('error');

  if (error) {
    console.error('Spotify auth error:', error);
    return false;
  }

  if (!code || !state) return false;

  const storedState = localStorage.getItem('spotify_auth_state');
  if (state !== storedState) {
    console.error('State mismatch - possible CSRF attack');
    return false;
  }

  try {
    const response = await fetch('/api/spotify/user-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        code, 
        redirect_uri: window.location.origin + '/' 
      })
    });

    if (!response.ok) throw new Error('Token exchange failed');
    
    const data = await response.json();
    
    if (data.access_token && data.expires_in) {
      const expiresAt = Date.now() + (data.expires_in * 1000);
      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_token_expires_at', expiresAt.toString());
    }

    window.history.replaceState({}, document.title, window.location.pathname);
    localStorage.removeItem('spotify_auth_state');

    return true;
  } catch (error) {
    console.error('Token exchange error:', error);
    return false;
  }
}

export async function spotifyApiCall(endpoint: string, useCache: boolean = true) {
  const cacheKey = getCacheKey(endpoint);
  
  if (useCache) {
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  const token = getAccessToken();

  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();
  
  if (useCache) {
    setCachedData(cacheKey, data);
  }

  return data;
}

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    images: { url: string }[];
  };
  playcount?: number;
  popularity?: number;
  danceability?: number;
  energy?: number;
  acousticness?: number;
}

interface Artist {
  name: string;
  images: { url: string }[];
  followers: { total: number };
  genres?: string[];
}

interface Playlist {
  id: string;
  name: string;
  tracks: {
    items: Track[];
    next: string | null;
  };
}

export async function getUserPlaylistItems(playlistId: string, limit = 50, offset = 0, useCache: boolean = true) {
  return spotifyApiCall(`/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`, useCache);
}

export async function getUserAllPlaylistItems(playlistId: string, limit = 50, offset = 0, useCache: boolean = true) {
  const allItems: Playlist[] = [];
  let hasMore = true;

  while (hasMore) {
    const response = await getUserPlaylistItems(playlistId, limit, offset, useCache);
    allItems.push(...response.items);
    hasMore = response.next !== null;
    offset += limit;
  }

  return allItems;
}

export async function getAllUserPlaylists(limit = 50, offset = 0, useCache: boolean = true) {
  const allPlaylists: Playlist[] = [];
  let hasMore = true;
  while (hasMore) {
    const response = await getUserPlaylists(limit, offset, useCache);
    allPlaylists.push(...response.items);
    hasMore = response.next !== null;
    offset += limit;
  }
  return allPlaylists;
}

export async function getUserItems(type: 'artists' | 'tracks', timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit = 50, useCache: boolean = true, fromPlaylistId: string | null = null) {
  // return either from playlist or top items
  if (fromPlaylistId) {
    return getUserAllPlaylistItems(fromPlaylistId, limit, 0, useCache);
  }
  return spotifyApiCall(`/me/top/${type}?time_range=${timeRange}&limit=${limit}`, useCache);
}

export async function getUserRecentlyPlayed(limit = 20, useCache: boolean = true) {
  return spotifyApiCall(`/me/player/recently-played?limit=${limit}`, useCache);
}

export async function getUserPlaylists(limit = 20, offset = 0, useCache: boolean = true) {
  return spotifyApiCall(`/me/playlists?limit=${limit}&offset=${offset}`, useCache);
}

export async function getUserTopGenres(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit = 10, useCache: boolean = true, fromPlaylistId: string | null = null) {
  const topArtists = await getUserItems('artists', timeRange, 50, useCache, fromPlaylistId);
  const genreMap: Record<string, number> = {};

  // Count genres from top artists
  for (const artist of topArtists.items as Artist[]) {
    const genres = artist.genres || [];
    for (const genre of genres) {
      genreMap[genre] = (genreMap[genre] || 0) + 1;
    }
  }

  return Object.entries(genreMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([name]) => name);
}

export async function getMbidsForSpotifyTracks(spotifyTrackIds: string[]): Promise<string[]> {
  const promises = spotifyTrackIds.map(async (spotifyId) => {
    const response = await fetch(`https://api.spotify.com/v1/tracks/${spotifyId}`, {
      headers: { 'Authorization': `Bearer ${getAccessToken()}` }
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.external_ids?.mbid || null;
  });
  const mbids = await Promise.all(promises);
  return mbids.filter((mbid): mbid is string => mbid !== null);
}

export async function getAudioFeatures(trackMbids: string[], useCache: boolean = true): Promise<string[]> {
  const promises = trackMbids.map(async (mbid) => {
    const url = `https://acousticbrainz.org/api/v1/${mbid}/high-level`;
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  });
  return Promise.all(promises);
}

export async function getTracksWithFeatures(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit = 50, useCache: boolean = true, fromPlaylistId: string | null = null) {
  const topItems = await getUserItems('tracks', timeRange, limit, useCache, fromPlaylistId);
  const tracks = topItems.items || [];

  const mbids = await getMbidsForSpotifyTracks(tracks.map((track: Track) => track.id));

  const audioFeaturesList = await getAudioFeatures(mbids, useCache);

  const tracksWithFeatures = tracks.map((track: Track, index: number) => ({
    ...track,
    audioFeatures: audioFeaturesList[index] || null
  }));

  return { items: tracksWithFeatures };
}