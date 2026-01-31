"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./playlist-analyzer.module.css";
import { motion } from "framer-motion";
import Dropdown from "@/components/Dropdown";
import Moods from "@/components/Moods";
import DecadesPieChart from "@/components/DecadesPieChart";
import { getUserItems, getUserTopGenres, getTracksWithFeatures } from "@/utils/spotify";
import type { Track, Artist } from "@/types/spotify";

export default function PlaylistAnalyzer() {
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    const [topGenres, setTopGenres] = useState<string[]>([]);
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [topTracksWithFeatures, setTopTracksWithFeatures] = useState<Track[]>([]);
    const [topArtists, setTopArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(false);
    const fetchIdRef = useRef(0);

    // Load selected playlist from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('selectedPlaylist');
            if (saved) {
                const playlist = JSON.parse(saved);
                setSelectedPlaylistId(playlist.id);
            }
        }
    }, []);

    // Fetch playlist data when playlist is selected
    useEffect(() => {
        if (!selectedPlaylistId) return;

        let isActive = true;
        const fetchId = ++fetchIdRef.current;

        const fetchPlaylistData = async () => {
            setLoading(true);
            setTopTracks([]);
            setTopArtists([]);
            setTopGenres([]);
            setTopTracksWithFeatures([]);

            try {
                const tracksResponse = await getUserItems('tracks', 'medium_term', 50, true, selectedPlaylistId);
                if (!isActive || fetchId !== fetchIdRef.current) return;
                setTopTracks(tracksResponse.items || []);

                const artistsResponse = await getUserItems('artists', 'medium_term', 50, true, selectedPlaylistId);
                if (!isActive || fetchId !== fetchIdRef.current) return;
                setTopArtists(artistsResponse.items || []);

                const genresResponse = await getUserTopGenres('medium_term', 10, true, selectedPlaylistId);
                if (!isActive || fetchId !== fetchIdRef.current) return;
                setTopGenres(genresResponse);

                const tracksWithFeaturesResponse = await getTracksWithFeatures('medium_term', 50, true, selectedPlaylistId);
                if (!isActive || fetchId !== fetchIdRef.current) return;
                setTopTracksWithFeatures(tracksWithFeaturesResponse.items || []);
            } catch (error) {
                if (!isActive || fetchId !== fetchIdRef.current) return;
                console.error('Error fetching playlist data:', error);
            } finally {
                if (!isActive || fetchId !== fetchIdRef.current) return;
                setLoading(false);
            }
        };

        fetchPlaylistData();

        return () => {
            isActive = false;
        };
    }, [selectedPlaylistId]);

    // Listen for playlist selection changes
    useEffect(() => {
        const handleStorageChange = () => {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('selectedPlaylist');
                if (saved) {
                    const playlist = JSON.parse(saved);
                    setSelectedPlaylistId(playlist.id);
                } else {
                    setSelectedPlaylistId(null);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also check for changes via custom event
        const handlePlaylistChange = () => handleStorageChange();
        window.addEventListener('playlistChanged', handlePlaylistChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('playlistChanged', handlePlaylistChange);
        };
    }, []);

    const decadesData = topTracks.reduce((acc, track) => {
        if (track?.album?.release_date) {
            const releaseYear = track.album.release_date.split("-")[0];
            const decade = `${Math.floor(Number(releaseYear) / 10) * 10}s`;
            acc[decade] = {
                count: (acc[decade]?.count || 0) + 1,
            };
        }
        return acc;
    }, {} as Record<string, { count: number }>);

    const moodData = React.useMemo(() => {
        if (topTracksWithFeatures.length === 0) {
            return {
                avgHappiness: 0,
                avgDanceability: 0,
                avgEnergy: 0,
                avgAcousticness: 0,
                happiestTrack: null,
                danceablestTrack: null,
                mostEnergeticTrack: null,
                mostAcousticTrack: null,
            };
        }

        const tracksWithValidFeatures = topTracksWithFeatures.filter(
            track => track.audioFeatures && typeof track.audioFeatures === 'object'
        );

        if (tracksWithValidFeatures.length === 0) {
            return {
                avgHappiness: 0,
                avgDanceability: 0,
                avgEnergy: 0,
                avgAcousticness: 0,
                happiestTrack: null,
                danceablestTrack: null,
                mostEnergeticTrack: null,
                mostAcousticTrack: null,
            };
        }

        const totals = tracksWithValidFeatures.reduce((acc, track) => {
            const features = track.audioFeatures!;
            return {
                valence: acc.valence + (features.valence || 0),
                danceability: acc.danceability + (features.danceability || 0),
                energy: acc.energy + (features.energy || 0),
                acousticness: acc.acousticness + (features.acousticness || 0),
            };
        }, { valence: 0, danceability: 0, energy: 0, acousticness: 0 });

        const count = tracksWithValidFeatures.length;

        const happiestTrack = tracksWithValidFeatures.reduce((prev, curr) => {
            const prevValence = prev.audioFeatures?.valence || 0;
            const currValence = curr.audioFeatures?.valence || 0;
            return currValence > prevValence ? curr : prev;
        });

        const danceablestTrack = tracksWithValidFeatures.reduce((prev, curr) => {
            const prevDanceability = prev.audioFeatures?.danceability || 0;
            const currDanceability = curr.audioFeatures?.danceability || 0;
            return currDanceability > prevDanceability ? curr : prev;
        });

        const mostEnergeticTrack = tracksWithValidFeatures.reduce((prev, curr) => {
            const prevEnergy = prev.audioFeatures?.energy || 0;
            const currEnergy = curr.audioFeatures?.energy || 0;
            return currEnergy > prevEnergy ? curr : prev;
        });

        const mostAcousticTrack = tracksWithValidFeatures.reduce((prev, curr) => {
            const prevAcousticness = prev.audioFeatures?.acousticness || 0;
            const currAcousticness = curr.audioFeatures?.acousticness || 0;
            return currAcousticness > prevAcousticness ? curr : prev;
        });

        return {
            avgHappiness: Math.round((totals.valence / count) * 100),
            avgDanceability: Math.round((totals.danceability / count) * 100),
            avgEnergy: Math.round((totals.energy / count) * 100),
            avgAcousticness: Math.round((totals.acousticness / count) * 100),
            happiestTrack,
            danceablestTrack,
            mostEnergeticTrack,
            mostAcousticTrack,
        };
    }, [topTracksWithFeatures]);

    return (
        <motion.main
            className="main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <h1 className="title">Playlist Analyzer</h1>
            <p className="description">
                Analyze your Spotify playlists to gain insights into your music preferences.
            </p>

            <div className={styles.dropdownContainer}>
                <Dropdown onPlaylistSelect={setSelectedPlaylistId} />
            </div>

            {loading && (
                <div className={styles.loading}>
                    <p>Loading playlist data...</p>
                </div>
            )}

            {!loading && selectedPlaylistId && topTracks.length > 0 && (
                <div className={styles.content}>
                    <div className={styles.summaryContainer}>
                        <h1 className={styles.h1}>Playlist Summary</h1>
                        <div className={styles.headerLine}></div>
                        <div className={styles.summaryGrid}>
                            <div className={`card ${styles.summaryCard}`}>
                                <h2>Latest Tracks</h2>
                                <ol>
                                    {topTracks.slice(0, 5).map((track, index) => (
                                        <React.Fragment key={track.id}>
                                            <li>{`${index + 1}. ${track.name} - ${track.artists.map(artist => artist.name).join(", ")}`}</li>
                                            {index !== 4 && <li className={styles.line}></li>}
                                        </React.Fragment>
                                    ))}
                                </ol>
                            </div>
                            <div className={`card ${styles.summaryCard}`}>
                                <h2>Top Artists</h2>
                                <ol>
                                    {topArtists.slice(0, 5).map((artist, index) => (
                                        <React.Fragment key={artist.id}>
                                            <li>{`${index + 1}. ${artist.name}`}</li>
                                            {index !== 4 && <li className={styles.line}></li>}
                                        </React.Fragment>
                                    ))}
                                </ol>
                            </div>
                            <div className={`card ${styles.summaryCard}`}>
                                <h2>Top Genres</h2>
                                <ol>
                                    {topGenres.slice(0, 5).map((genre, index) => (
                                        <React.Fragment key={genre}>
                                            <li>{`${index + 1}. ${genre}`}</li>
                                            {index !== 4 && <li className={styles.line}></li>}
                                        </React.Fragment>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>

                    <Moods moodData={moodData} />

                    <div className={styles.decadesContainer}>
                        <h1 className={styles.h2}>By Decades</h1>
                        <div className={styles.headerLine}></div>
                        <div className={styles.pieChartContainer}>
                            <DecadesPieChart 
                                data={Object.entries(decadesData).map(([decade, { count }]) => ({ decade, count }))}
                            />
                        </div>
                        <div className={styles.decadesGrid}>
                            {Object.entries(decadesData).map(([decade, data]) => (
                                <div key={decade} className={`card ${styles.decadeCard}`}>
                                    <h3>{decade}</h3>
                                    <p>Tracks: {data.count}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {!loading && selectedPlaylistId && topTracks.length === 0 && (
                <div className={styles.noData}>
                    <p>No tracks found in this playlist.</p>
                </div>
            )}
        </motion.main>
    );
}