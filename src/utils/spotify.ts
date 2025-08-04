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
    
    // Store tokens
    const expiresAt = Date.now() + (data.expires_in * 1000);
    localStorage.setItem('spotify_access_token', data.access_token);
    localStorage.setItem('spotify_token_expires_at', expiresAt.toString());
    
    // Clean up
    window.history.replaceState({}, document.title, window.location.pathname);
    localStorage.removeItem('spotify_auth_state');
    
    return true;
  } catch (error) {
    console.error('Token exchange error:', error);
    return false;
  }
}

// Simplified API call helper
export async function spotifyApiCall(endpoint: string) {
  const token = getAccessToken();
  if (!token) throw new Error('No access token available');

  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`);
  }

  return response.json();
}
