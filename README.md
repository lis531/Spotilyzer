# Spotilyzer - Spotify Analytics Web App

A Next.js application that analyzes your Spotify listening habits and provides insights into your music preferences.

## Features

- Spotify OAuth authentication
- User listening data analysis
- Mood analysis based on audio features
- Playlist creation capabilities

## How to Use Spotilyzer

1. **Visit the App**: Go to [spotilyzer.vercel.app](https://spotilyzer.vercel.app)
2. **Connect Your Spotify**: Click "Connect with Spotify" button
3. **Login with Your Spotify Account**: Use your existing Spotify credentials
4. **Grant Permissions**: Allow Spotilyzer to access your listening data
5. **Explore Your Music**: Discover insights about your listening habits, top artists, genres, and more!

## How Authentication Works

### What Happens When You Login:
- You're redirected to Spotify's secure login page
- After logging in, you grant permission to Spotilyzer
- Your access token is stored securely in your browser
- Spotilyzer fetches your personalized music data
- You can log out anytime to revoke access

### Your Privacy & Security:
- Your Spotify password is never seen by Spotilyzer
- Only music data is accessed (no personal info beyond what you share)
- Data stays in your browser - not stored on my servers
- You can revoke access anytime through Spotify settings
- CSRF protection prevents unauthorized access

## What Data I Access

With your permission, Spotilyzer accesses:
- **Basic Profile**: Your Spotify username and profile picture
- **Listening History**: Your top artists, tracks, and recently played songs
- **Music Library**: Your liked songs and saved tracks
- **Playlist Access**: Ability to create playlists based on your preferences (optional)

## Spotify Permissions Explained

When you connect, you'll be asked to grant these permissions:
- `user-read-private`: Basic profile information
- `user-read-email`: Email address (for account identification)
- `user-top-read`: Your top artists and tracks
- `user-read-recently-played`: Recently played tracks
- `user-library-read`: Your liked songs
- `playlist-modify-public`: Create public playlists (optional feature)
- `playlist-modify-private`: Create private playlists (optional feature)

## What You'll Discover

### Music Analytics
- **Music Journey**: How your taste has evolved
- **Genre Exploration**: Dive deeper into your favorite genres
- **Playlist Suggestions**: Playlists created from your genres and moods
- **Share-worthy Stats**: Cool facts about your music

## Ready to Explore Your Music?

[**Start Analyzing Your Spotify Data →**](https://spotilyzer.vercel.app)

---

*Spotilyzer is not affiliated with Spotify. Spotify is a trademark of Spotify AB.*
