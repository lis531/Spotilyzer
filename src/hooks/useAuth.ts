"use client";
import { useState, useEffect } from 'react';
import { isAuthenticated, getSpotifyAuthUrl, handleSpotifyCallback, logout, getAccessToken } from '@/utils/spotify';

interface UserInfo {
  id: string;
  display_name: string;
  email: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  followers: {
    total: number;
  };
  country: string;
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    // Load user info from localStorage on initialization
    if (typeof window !== 'undefined') {
      const storedUserInfo = localStorage.getItem('spotify_user_info');
      if (storedUserInfo) {
        try {
          return JSON.parse(storedUserInfo);
        } catch (error) {
          console.error('Failed to parse stored user info:', error);
        }
      }
    }
    return null;
  });

  const fetchUserData = async () => {
    try {
      const token = getAccessToken();
      if (!token) return;

      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData);
        // Store user info in localStorage
        localStorage.setItem('spotify_user_info', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      // Handle Spotify callback if present
      const callbackSuccess = await handleSpotifyCallback();
      if (callbackSuccess) {
        setIsLoggedIn(true);
        await fetchUserData();
        setLoading(false);
        return;
      }

      // Check if already authenticated
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
      
      if (getAccessToken() && authenticated) {
          await fetchUserData();
      } else {
        if (userInfo) {
          setUserInfo(null);
          localStorage.removeItem('spotify_user_info');
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, [userInfo]);

  const login = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUserInfo(null);
    // Clear user info from localStorage on logout
    if (typeof window !== 'undefined') {
      localStorage.removeItem('spotify_user_info');
    }
  };

  return { isLoggedIn, loading, userInfo, login, logout: handleLogout };
}
