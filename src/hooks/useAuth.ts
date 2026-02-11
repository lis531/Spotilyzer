"use client";
import { useState, useEffect } from "react";
import {
	isAuthenticated,
	getSpotifyAuthUrl,
	handleSpotifyCallback,
	logout,
	getAccessToken,
	spotifyApiCall,
	setManualAccessToken,
	validateAccessToken,
} from "@/utils/spotify";

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
		if (typeof window === "undefined") return null;
		const storedUserInfo = localStorage.getItem("spotify_user_info");
		return storedUserInfo ? JSON.parse(storedUserInfo) : null;
	});

	const fetchUserData = async () => {
		try {
			const token = getAccessToken();
			if (!token) return;

			const userData = await spotifyApiCall("/me", false);
			if (userData && userData.id) {
				setUserInfo(userData);
				localStorage.setItem("spotify_user_info", JSON.stringify(userData));
			}
		} catch (error) {
			console.error("Failed to fetch user data:", error);
		}
	};

	useEffect(() => {
		const initAuth = async () => {
			const callbackSuccess = await handleSpotifyCallback();
			if (callbackSuccess) {
				setIsLoggedIn(true);
				await fetchUserData();
				setLoading(false);
				return;
			}

			const authenticated = isAuthenticated();
			setIsLoggedIn(authenticated);

			if (getAccessToken() && authenticated) {
				await fetchUserData();
			} else if (userInfo) {
				setUserInfo(null);
				localStorage.removeItem("spotify_user_info");
			}

			setLoading(false);
		};

		void initAuth();
	}, [userInfo]);

	const login = () => {
		window.location.href = getSpotifyAuthUrl();
	};

	const loginWithToken = async (token: string): Promise<boolean> => {
		const isValid = await validateAccessToken(token);
		if (isValid) {
			setManualAccessToken(token);
			setIsLoggedIn(true);
			await fetchUserData();
			return true;
		}
		return false;
	};

	const handleLogout = () => {
		logout();
		setIsLoggedIn(false);
		setUserInfo(null);
		localStorage.removeItem("spotify_user_info");
	};

	return {
		isLoggedIn,
		loading,
		userInfo,
		login,
		loginWithToken,
		logout: handleLogout,
	};
}
