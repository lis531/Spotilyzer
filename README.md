# Spotilyzer - Spotify Analytics Web App

A Next.js application that analyzes your Spotify listening habits and provides insights into your music preferences.

## 🎵 Features

- Spotify OAuth authentication
- User profile and listening data analysis
- Top tracks and artists visualization
- Mood analysis based on audio features
- Playlist creation capabilities

## 🚀 How to Use Spotilyzer

1. **Visit the App**: Go to [spotilyzer.vercel.app](https://spotilyzer.vercel.app)
2. **Connect Your Spotify**: Click "Connect with Spotify" button
3. **Login with Your Spotify Account**: Use your existing Spotify credentials
4. **Grant Permissions**: Allow Spotilyzer to access your listening data
5. **Explore Your Music**: Discover insights about your listening habits, top artists, genres, and more!

## 🔐 How Authentication Works

### What Happens When You Login:
- You're redirected to Spotify's secure login page
- After logging in, you grant permission to Spotilyzer
- Your access token is stored securely in your browser
- Spotilyzer fetches your personalized music data
- You can logout anytime to revoke access

### Your Privacy & Security:
- ✅ Your Spotify password is never seen by Spotilyzer
- ✅ Only music data is accessed (no personal info beyond what you share)
- ✅ Data stays in your browser - not stored on my servers
- ✅ You can revoke access anytime through Spotify settings
- ✅ CSRF protection prevents unauthorized access

## 📱 What Data I Access

With your permission, Spotilyzer accesses:
- **Basic Profile**: Your Spotify username and profile picture
- **Listening History**: Your top artists, tracks, and recently played songs
- **Music Library**: Your liked songs and saved tracks
- **Playlist Access**: Ability to create playlists based on your preferences (optional)

## 📋 Spotify Permissions Explained

When you connect, you'll be asked to grant these permissions:
- `user-read-private`: Basic profile information
- `user-read-email`: Email address (for account identification)
- `user-top-read`: Your top artists and tracks
- `user-read-recently-played`: Recently played tracks
- `user-library-read`: Your liked songs
- `playlist-modify-public`: Create public playlists (optional feature)
- `playlist-modify-private`: Create private playlists (optional feature)

## 🎨 What You'll Discover

### Music Analytics:
- **Top Artists & Tracks**: See who and what you listen to most
- **Genre Breakdown**: Discover your music taste profile
- **Listening Patterns**: When and how often you listen
- **Mood Analysis**: Happy, energetic, chill - what's your vibe?

### Personalized Insights:
- **Music Journey**: How your taste has evolved
- **Hidden Gems**: Lesser-known tracks you love
- **Playlist Suggestions**: Custom playlists based on your preferences
- **Share-worthy Stats**: Cool facts about your music habits

## ❓ FAQ

**Q: Is Spotilyzer free to use?**
A: Yes! Completely free.

**Q: Do I need Spotify Premium?**
A: No, any Spotify account works (free or premium).

**Q: Will this affect my Spotify recommendations?**
A: No, Spotilyzer only reads your data - it doesn't change anything.

**Q: Can I revoke access later?**
A: Yes! Go to Spotify Settings > Privacy Settings > Apps and remove Spotilyzer.

**Q: Do you store my data?**
A: No, all data analysis happens in your browser. Nothing is saved on my servers.

## 🚨 Troubleshooting

**"Connection Failed"**: Make sure you're logged into Spotify in your browser first.

**"Access Denied"**: You might have clicked "Cancel" during login. Try again and click "Agree".

**"Data Not Loading"**: Clear your browser cache and try reconnecting.

## 🎵 Ready to Explore Your Music?

[**Start Analyzing Your Spotify Data →**](https://spotilyzer.vercel.app)

---

*Spotilyzer is not affiliated with Spotify. Spotify is a trademark of Spotify AB.*
