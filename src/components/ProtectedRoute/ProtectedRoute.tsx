"use client";
import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import styles from "./ProtectedRoute.module.css";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, loading, login, loginWithToken } = useAuth();
  const [accessToken, setAccessToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleManualLogin = async () => {
    if (!accessToken.trim()) {
      setError("Please enter an access token");
      return;
    }

    setIsLoading(true);
    setError("");

    const success = await loginWithToken(accessToken.trim());

    if (!success) {
      setError("Invalid access token. Please check and try again.");
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <motion.main
          className="main"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className={styles.loadingContainer}>
            <p>Loading...</p>
          </div>
        </motion.main>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="page">
        <motion.main
          className="main"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className={styles.authContainer}>
            <h1 className={styles.authTitle}>Welcome to Spotilyzer</h1>
            <p className={styles.authDescription}>
              Connect your Spotify account to analyze your listening habits and discover new music insights.
            </p>

            <button
              className={styles.spotifyButton}
              onClick={login}
            >
              <svg className={styles.spotifyIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              Connect with Spotify
            </button>

            <div className={styles.divider}>
              <span>OR</span>
            </div>

            <div className={styles.manualAuthSection}>
              <p className={styles.manualAuthTitle}>Use Access Token</p>
              <p className={styles.manualAuthDescription}>
                Already have a Spotify access token? Paste it below to get started.
              </p>
              <input
                type="text"
                className={styles.tokenInput}
                placeholder="Paste your Spotify access token here"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                disabled={isLoading}
              />
              {error && <p className={styles.errorMessage}>{error}</p>}
              <button
                className={styles.manualLoginButton}
                onClick={handleManualLogin}
                disabled={isLoading}
              >
                {isLoading ? "Validating..." : "Continue with Token"}
              </button>
              <p className={styles.tokenHint}>
                Get your token from the{" "}
                <a
                  href="https://developer.spotify.com/console/get-current-user/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Spotify Web API Console
                </a>
              </p>
            </div>

            <p className={styles.authDisclaimer}>
              We&apos;ll only access your listening data to provide personalized insights. Your data stays private.
            </p>
          </div>
        </motion.main>
      </div>
    );
  }

  return <>{children}</>;
}
