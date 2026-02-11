"use client";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import styles from "./playlist-analyzer.module.css";
import { motion } from "framer-motion";
import Dropdown from "@/components/Dropdown";
import Moods from "@/components/Moods";
import DecadesPieChart from "@/components/DecadesPieChart";
import { getUserItems, getUserTopGenres, getTracksWithFeatures } from "@/utils/spotify";
import type { Track, Artist } from "@/types/spotify";
import summaryStyles from "@/styles/summary.module.css";

export default function PlaylistAnalyzer() {
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    const [topGenres, setTopGenres] = useState<string[]>([]);
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [topTracksWithFeatures, setTopTracksWithFeatures] = useState<Track[]>([]);
    const [topArtists, setTopArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(false);
    const fetchIdRef = useRef(0);

    useEffect(() => {
        const saved = localStorage.getItem('selectedPlaylist');
        if (saved) {
            setSelectedPlaylistId(JSON.parse(saved).id);
        }
    }, []);

    // Fetch playlist data when playlist is selected
    useEffect(() => {
        if (!selectedPlaylistId) return;

        let isActive = true;
        const fetchId = ++fetchIdRef.current;

        const isCurrent = () => isActive && fetchId === fetchIdRef.current;

        const fetchPlaylistData = async () => {
            setLoading(true);
            setTopTracks([]);
            setTopArtists([]);
            setTopGenres([]);
            setTopTracksWithFeatures([]);

            try {
                const [tracksResponse, artistsResponse, genresResponse, tracksWithFeaturesResponse] = await Promise.all([
                    getUserItems('tracks', 'medium_term', 50, true, selectedPlaylistId),
                    getUserItems('artists', 'medium_term', 50, true, selectedPlaylistId),
                    getUserTopGenres('medium_term', 10, true, selectedPlaylistId),
                    getTracksWithFeatures('medium_term', 50, true, selectedPlaylistId),
                ]);

                if (!isCurrent()) return;
                setTopTracks(tracksResponse.items);
                setTopArtists(artistsResponse.items);
                setTopGenres(genresResponse);
                setTopTracksWithFeatures(tracksWithFeaturesResponse.items);
            } catch (error) {
                if (!isCurrent()) return;
                console.error('Error fetching playlist data:', error);
            } finally {
                if (isCurrent()) {
                    setLoading(false);
                }
            }
        };

        void fetchPlaylistData();

        return () => {
            isActive = false;
        };
    }, [selectedPlaylistId]);

    useEffect(() => {
        const handleStorageChange = () => {
            const saved = localStorage.getItem('selectedPlaylist');
            setSelectedPlaylistId(saved ? JSON.parse(saved).id : null);
        };

        window.addEventListener('storage', handleStorageChange);
        const handlePlaylistChange = () => handleStorageChange();
        window.addEventListener('playlistChanged', handlePlaylistChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('playlistChanged', handlePlaylistChange);
        };
    }, []);

    const decadesData = topTracks.reduce((acc, track) => {
        const releaseYear = track.album.release_date.split("-")[0];
        const decade = `${Math.floor(Number(releaseYear) / 10) * 10}s`;
        acc[decade] = { count: (acc[decade]?.count || 0) + 1 };
        return acc;
    }, {} as Record<string, { count: number }>);

    const moodData = useMemo(() => {
        const emptyMood = {
            avgHappiness: 0,
            avgDanceability: 0,
            avgEnergy: 0,
            avgAcousticness: 0,
            happiestTrack: null,
            danceablestTrack: null,
            mostEnergeticTrack: null,
            mostAcousticTrack: null,
        };

        if (topTracksWithFeatures.length === 0) return emptyMood;

        const tracksWithValidFeatures = topTracksWithFeatures.filter(
            track => track.audioFeatures
        );

        if (tracksWithValidFeatures.length === 0) return emptyMood;

        const totals = tracksWithValidFeatures.reduce((acc, track) => {
            const features = track.audioFeatures!;
            return {
                valence: acc.valence + (features.valence ?? 0),
                danceability: acc.danceability + (features.danceability ?? 0),
                energy: acc.energy + (features.energy ?? 0),
                acousticness: acc.acousticness + (features.acousticness ?? 0),
            };
        }, { valence: 0, danceability: 0, energy: 0, acousticness: 0 });

        const count = tracksWithValidFeatures.length;
        const maxBy = (key: keyof NonNullable<Track["audioFeatures"]>) =>
            tracksWithValidFeatures.reduce((prev, curr) =>
                (curr.audioFeatures?.[key] ?? 0) > (prev.audioFeatures?.[key] ?? 0) ? curr : prev
            );

        return {
            avgHappiness: Math.round((totals.valence / count) * 100),
            avgDanceability: Math.round((totals.danceability / count) * 100),
            avgEnergy: Math.round((totals.energy / count) * 100),
            avgAcousticness: Math.round((totals.acousticness / count) * 100),
            happiestTrack: maxBy("valence"),
            danceablestTrack: maxBy("danceability"),
            mostEnergeticTrack: maxBy("energy"),
            mostAcousticTrack: maxBy("acousticness"),
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
                    <div className={summaryStyles.summaryContainer}>
                        <h1 className={summaryStyles.h1}>Playlist Summary</h1>
                        <div className={summaryStyles.headerLine}></div>
                        <div className={summaryStyles.summaryGrid}>
                            <div className={`card ${summaryStyles.summaryCard}`}>
                                <h2>Latest Tracks</h2>
                                <ol>
                                    {topTracks.slice(0, 5).map((track, index) => (
                                        <Fragment key={track.id}>
                                            <li>{`${index + 1}. ${track.name} - ${track.artists.map(artist => artist.name).join(", ")}`}</li>
                                            {index !== 4 && <li className={summaryStyles.line}></li>}
                                        </Fragment>
                                    ))}
                                </ol>
                            </div>
                            <div className={`card ${summaryStyles.summaryCard}`}>
                                <h2>Top Artists</h2>
                                <ol>
                                    {topArtists.slice(0, 5).map((artist, index) => (
                                        <Fragment key={artist.id}>
                                            <li>{`${index + 1}. ${artist.name}`}</li>
                                            {index !== 4 && <li className={summaryStyles.line}></li>}
                                        </Fragment>
                                    ))}
                                </ol>
                            </div>
                            <div className={`card ${summaryStyles.summaryCard}`}>
                                <h2>Top Genres</h2>
                                <ol>
                                    {topGenres.slice(0, 5).map((genre, index) => (
                                        <Fragment key={genre}>
                                            <li>{`${index + 1}. ${genre}`}</li>
                                            {index !== 4 && <li className={summaryStyles.line}></li>}
                                        </Fragment>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>

                    <Moods moodData={moodData} />

                    <div className={summaryStyles.decadesContainer}>
                        <h1 className={summaryStyles.h2}>By Decades</h1>
                        <div className={summaryStyles.headerLine}></div>
                        <div className={summaryStyles.pieChartContainer}>
                            <DecadesPieChart
                                data={Object.entries(decadesData).map(([decade, { count }]) => ({ decade, count }))}
                            />
                        </div>
                        <div className={summaryStyles.decadesGrid}>
                            {Object.entries(decadesData).map(([decade, data]) => (
                                <div key={decade} className={`card ${summaryStyles.decadeCard}`}>
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