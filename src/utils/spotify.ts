import type { Track, Artist, Playlist, AudioFeatures, TimeRange } from "@/types/spotify";

// Spotify OAuth configuration
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_SCOPES = [
	"user-read-private",
	"user-read-email",
	"user-top-read",
	"user-read-recently-played",
	"user-library-read",
	"playlist-modify-public",
	"playlist-modify-private",
].join(" ");

const CACHE_DURATION = 10 * 60 * 1000;
const CACHE_PREFIX = "spotify_cache_";
const DEFAULT_RETRY_ATTEMPTS = 5;
const BASE_RETRY_DELAY_MS = 500;
const PAGINATION_DELAY_MS = 200;
const LIKED_SONGS_CACHE_DURATION_MS = 2 * 60 * 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let likedSongsCache: { items: any[]; timestamp: number } | null = null;

function getCacheKey(
	endpoint: string,
	params: Record<string, unknown> = {},
): string {
	const paramString = Object.keys(params).length
		? `_${JSON.stringify(params)}`
		: "";
	return `${CACHE_PREFIX}${endpoint}${paramString}`;
}

function getCachedData(cacheKey: string): unknown | null {
	if (typeof window === "undefined") return null;

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
	if (typeof window === "undefined") return;

	const cacheData = {
		data,
		timestamp: Date.now(),
	};
	localStorage.setItem(cacheKey, JSON.stringify(cacheData));
}

export function clearSpotifyCache(): void {
	if (typeof window === "undefined") return;

	const keysToRemove: string[] = [];
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key && key.startsWith(CACHE_PREFIX)) {
			keysToRemove.push(key);
		}
	}

	keysToRemove.forEach((key) => localStorage.removeItem(key));
}

// Token management
export function isAuthenticated(): boolean {
	if (typeof window === "undefined") return false;

	const token = localStorage.getItem("spotify_access_token");
	const expiresAt = localStorage.getItem("spotify_token_expires_at");

	if (!token || !expiresAt) return false;

	return Date.now() < parseInt(expiresAt);
}

export function getAccessToken(): string | null {
	if (!isAuthenticated()) return null;
	return localStorage.getItem("spotify_access_token");
}

export function logout(): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem("spotify_access_token");
	localStorage.removeItem("spotify_token_expires_at");
	localStorage.removeItem("spotify_auth_state");
	localStorage.removeItem("spotify_user_info");
	clearSpotifyCache();
}

// Auth flow
export function getSpotifyAuthUrl(): string {
	const state = Math.random().toString(36).substring(2, 15);
	localStorage.setItem("spotify_auth_state", state);

	const params = new URLSearchParams({
		response_type: "code",
		client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
		scope: SPOTIFY_SCOPES,
		redirect_uri: window.location.origin + "/",
		state: state,
		show_dialog: "true",
	});

	return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

export async function handleSpotifyCallback(): Promise<boolean> {
	if (typeof window === "undefined") return false;

	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get("code");
	const state = urlParams.get("state");
	const error = urlParams.get("error");

	if (error) {
		console.error("Spotify auth error:", error);
		return false;
	}

	if (!code || !state) return false;

	const storedState = localStorage.getItem("spotify_auth_state");
	if (state !== storedState) {
		console.error("State mismatch - possible CSRF attack");
		return false;
	}

	try {
		const response = await fetch("/api/spotify/user-token", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				code,
				redirect_uri: window.location.origin + "/",
			}),
		});

		if (!response.ok) throw new Error("Token exchange failed");

		const data = await response.json();

		if (data.access_token && data.expires_in) {
			const expiresAt = Date.now() + data.expires_in * 1000;
			localStorage.setItem("spotify_access_token", data.access_token);
			localStorage.setItem("spotify_token_expires_at", expiresAt.toString());
		}

		window.history.replaceState({}, document.title, window.location.pathname);
		localStorage.removeItem("spotify_auth_state");

		return true;
	} catch (error) {
		console.error("Token exchange error:", error);
		return false;
	}
}

export async function spotifyApiCall(
	endpoint: string,
	useCache: boolean = true,
) {
	const cacheKey = getCacheKey(endpoint);

	if (useCache) {
		const cachedData = getCachedData(cacheKey);
		if (cachedData) {
			return cachedData;
		}
	}

	const token = getAccessToken();

	let attempt = 0;
	let lastResponse: Response | null = null;

	while (attempt <= DEFAULT_RETRY_ATTEMPTS) {
		const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		lastResponse = response;

		if (response.status === 429) {
			const retryAfterHeader = response.headers.get("Retry-After");
			const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : NaN;
			const delayMs = Number.isFinite(retryAfterSeconds)
				? retryAfterSeconds * 1000
				: BASE_RETRY_DELAY_MS * Math.pow(2, attempt);
			await sleep(delayMs);
			attempt += 1;
			continue;
		}

		if (!response.ok && response.status >= 500 && attempt < DEFAULT_RETRY_ATTEMPTS) {
			await sleep(BASE_RETRY_DELAY_MS * Math.pow(2, attempt));
			attempt += 1;
			continue;
		}

		const data = await response.json();
		if (useCache) {
			setCachedData(cacheKey, data);
		}
		return data;
	}

	if (lastResponse) {
		try {
			return await lastResponse.json();
		} catch {
			return {};
		}
	}

	return {};
}

export async function getUserPlaylistItems(
	playlistId: string,
	limit = 50,
	offset = 0,
	useCache: boolean = true,
) {
	return spotifyApiCall(
		`/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
		useCache,
	);
}

export async function getUserAllPlaylistItems(
	playlistId: string,
	limit = 50,
	offset = 0,
	useCache: boolean = true,
) {
	const allItems: any[] = [];
	let hasMore = true;

	while (hasMore) {
		const response = await getUserPlaylistItems(
			playlistId,
			limit,
			offset,
			useCache,
		);
		// Playlist items are wrapped in a 'track' property
		const tracks = response.items.map((item: any) => item.track).filter(Boolean);
		allItems.push(...tracks);
		hasMore = response.next !== null;
		offset += limit;
	}

	return { items: allItems };
}

export async function getAllUserPlaylists(
	limit = 50,
	useCache: boolean = false,
) {
	const allPlaylists: Playlist[] = [];
	let hasMore = true;
	let offset = 0;
	
	while (hasMore) {
		const response = await getUserPlaylists(limit, offset, useCache);
		if (response && response.items && Array.isArray(response.items)) {
			allPlaylists.push(...response.items);
			hasMore = response.next !== null;
		} else {
			hasMore = false;
		}
		offset += limit;
	}
	return allPlaylists;
}

export async function getUserItems(
	type: "artists" | "tracks",
	timeRange: TimeRange = "medium_term",
	limit = 50,
	useCache: boolean = true,
	fromPlaylistId: string | null = null,
) {
	// Handle liked songs
	if (fromPlaylistId === 'liked-songs') {
		if (type === 'tracks') {
			return await getAllLikedSongs(false);
		} else if (type === 'artists') {
			const savedTracks = await getAllLikedSongs(false);
			const artistMap = new Map<string, Artist>();
			savedTracks.items.forEach((track: any) => {
				track?.artists?.forEach((artist: any) => {
					if (!artistMap.has(artist.id)) {
						artistMap.set(artist.id, {
							id: artist.id,
							name: artist.name,
							images: artist.images || [],
							followers: { total: 0 },
							genres: [],
						});
					}
				});
			});
			return { items: Array.from(artistMap.values()) };
		}
	}
	
	// return either from playlist or top items
	if (fromPlaylistId) {
		const playlistData = await getUserAllPlaylistItems(fromPlaylistId, limit, 0, useCache);
		
		if (type === "artists") {
			// Extract unique artists from tracks
			const artistMap = new Map<string, Artist>();
			playlistData.items.forEach((track: any) => {
				track.artists?.forEach((artist: any) => {
					if (!artistMap.has(artist.id)) {
						artistMap.set(artist.id, {
							id: artist.id,
							name: artist.name,
							images: artist.images || [],
							followers: { total: 0 },
							genres: [],
						});
					}
				});
			});
			return { items: Array.from(artistMap.values()) };
		}
		
		return playlistData;
	}
	return spotifyApiCall(
		`/me/top/${type}?time_range=${timeRange}&limit=${limit}`,
		useCache,
	);
}

export async function getUserRecentlyPlayed(
	limit = 20,
	useCache: boolean = true,
) {
	return spotifyApiCall(`/me/player/recently-played?limit=${limit}`, useCache);
}

export async function getUserPlaylists(
	limit = 20,
	offset = 0,
	useCache: boolean = true,
) {
	return spotifyApiCall(
		`/me/playlists?limit=${limit}&offset=${offset}`,
		useCache,
	);
}

export async function getAllLikedSongs(
	useCache: boolean = true,
) {
	if (likedSongsCache && Date.now() - likedSongsCache.timestamp < LIKED_SONGS_CACHE_DURATION_MS) {
		return { items: likedSongsCache.items };
	}

	const allTracks: any[] = [];
	let hasMore = true;
	let offset = 0;
	const limit = 50;
	
	while (hasMore) {
		const response = await spotifyApiCall(
			`/me/tracks?limit=${limit}&offset=${offset}`,
			useCache,
		);
		
		if (response && response.items && Array.isArray(response.items)) {
			const tracks = response.items.map((item: any) => item.track).filter(Boolean);
			allTracks.push(...tracks);
			hasMore = response.next !== null;
		} else {
			hasMore = false;
		}
		
		offset += limit;
		if (hasMore) {
			await sleep(PAGINATION_DELAY_MS);
		}
	}

	likedSongsCache = { items: allTracks, timestamp: Date.now() };
	return { items: allTracks };
}

export async function getUserTopGenres(
	timeRange: TimeRange = "medium_term",
	limit = 10,
	useCache: boolean = true,
	fromPlaylistId: string | null = null,
) {
	if (fromPlaylistId === 'liked-songs') {
		const savedTracks = await getAllLikedSongs(false);
		const artistIds = new Set<string>();
		
		savedTracks.items.forEach((track: any) => {
			track?.artists?.forEach((artist: any) => {
				if (artist.id) artistIds.add(artist.id);
			});
		});

		const genreMap: Record<string, number> = {};
		
		const artistIdArray = Array.from(artistIds).slice(0, 50);
		const artistDetailsPromises = artistIdArray.map(async (id) => {
			try {
				return await spotifyApiCall(`/artists/${id}`, useCache);
			} catch (error) {
				return null;
			}
		});
		
		const artistDetails = await Promise.all(artistDetailsPromises);
		
		artistDetails.forEach((artist: any) => {
			if (artist?.genres) {
				artist.genres.forEach((genre: string) => {
					genreMap[genre] = (genreMap[genre] || 0) + 1;
				});
			}
		});

		return Object.entries(genreMap)
			.sort(([, a], [, b]) => b - a)
			.slice(0, limit)
			.map(([name]) => name);
	}
	
	if (fromPlaylistId) {
		// For playlists, get artists from tracks and fetch their full details
		const playlistData = await getUserAllPlaylistItems(fromPlaylistId, 50, 0, useCache);
		const artistIds = new Set<string>();
		
		playlistData.items.forEach((track: any) => {
			track.artists?.forEach((artist: any) => {
				if (artist.id) artistIds.add(artist.id);
			});
		});

		const genreMap: Record<string, number> = {};
		
		// Fetch artist details in batches to get genres
		const artistIdArray = Array.from(artistIds).slice(0, 50);
		const artistDetailsPromises = artistIdArray.map(async (id) => {
			try {
				return await spotifyApiCall(`/artists/${id}`, useCache);
			} catch (error) {
				return null;
			}
		});
		
		const artistDetails = await Promise.all(artistDetailsPromises);
		
		artistDetails.forEach((artist: any) => {
			if (artist?.genres) {
				artist.genres.forEach((genre: string) => {
					genreMap[genre] = (genreMap[genre] || 0) + 1;
				});
			}
		});

		return Object.entries(genreMap)
			.sort(([, a], [, b]) => b - a)
			.slice(0, limit)
			.map(([name]) => name);
	}

	const topArtists = await getUserItems(
		"artists",
		timeRange,
		50,
		useCache,
		fromPlaylistId,
	);
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

export async function getAudioFeatures(
	trackIds: string[],
	useCache: boolean = true,
	spotifyIdToIsrc: Record<string, string> = {},
): Promise<(AudioFeatures | null)[]> {
	// Helper to chunk array into smaller pieces
	const chunkArray = <T,>(arr: T[], size: number): T[][] => {
		const chunks: T[][] = [];
		for (let i = 0; i < arr.length; i += size) {
			chunks.push(arr.slice(i, i + size));
		}
		return chunks;
	};

	// Fetch Reccobeats track data in chunks of 40
	const fetchReccobeatsTrackData = async (chunk: string[]) => {
		const url = `https://api.reccobeats.com/v1/track?${chunk.map((id) => `ids=${id}`).join("&")}`;
		try {
			const response = await fetch(url, { headers: { Accept: "application/json" } });
			if (!response.ok) return [];
			const data = await response.json();
			return Array.isArray(data.content) ? data.content : [];
		} catch (error) {
			console.error("Failed to fetch Reccobeats data:", error);
			return [];
		}
	};

	// Fetch all track data
	const chunks = chunkArray(trackIds, 40);
	const allTrackDataArrays = await Promise.all(chunks.map(fetchReccobeatsTrackData));
	const allTrackData = allTrackDataArrays.flat();

	// Map Spotify IDs to Reccobeats IDs using ISRC codes
	const reccobeatsIds = trackIds.map((spotifyId) => {
		const isrc = spotifyIdToIsrc[spotifyId];
		if (!isrc) return null;
		const trackObj = allTrackData.find((t: any) => t?.isrc === isrc);
		return trackObj?.id || null;
	});

	// Fetch audio features for each Reccobeats ID
	const fetchAudioFeatures = async (reccobeatsId: string | null) => {
		if (!reccobeatsId) return null;
		try {
			const response = await fetch(
				`https://api.reccobeats.com/v1/track/${reccobeatsId}/audio-features`,
				{ headers: { Accept: "application/json" } }
			);
			return response.ok ? await response.json() : null;
		} catch (error) {
			console.error("Failed to fetch audio features:", error);
			return null;
		}
	};

	return Promise.all(reccobeatsIds.map(fetchAudioFeatures));
}

export async function getTracksWithFeatures(
	timeRange: TimeRange = "medium_term",
	limit = 50,
	useCache: boolean = true,
	fromPlaylistId: string | null = null,
) {
	const topItems = await getUserItems("tracks", timeRange, limit, useCache, fromPlaylistId);
	const tracks = topItems.items || [];
	
	// Build ISRC mapping
	const spotifyIdToIsrc: Record<string, string> = {};
	tracks.forEach((track: any) => {
		if (track?.id && track?.external_ids?.isrc) {
			spotifyIdToIsrc[track.id] = track.external_ids.isrc;
		}
	});
	
	// Get audio features
	const trackIds = tracks.map((track: any) => track.id).filter(Boolean);
	const audioFeaturesList = trackIds.length > 0
		? await getAudioFeatures(trackIds, useCache, spotifyIdToIsrc)
		: [];
	
	// Merge tracks with their audio features
	return {
		items: tracks.map((track: any, index: number) => ({
			...track,
			audioFeatures: audioFeaturesList[index] || null,
		})),
	};
}
