"use client";
import React, { useState, useEffect } from "react";
import styles from "./tracks.module.css";
import { motion } from "framer-motion";
import { getUserItems } from "@/utils/spotify";
import Image from "next/image";
import TimeRangeButtons from "@/components/TimeRangeButtons/TimeRangeButtons";

interface Track {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
        images: { url: string }[];
    };
    playcount?: number;
}

export default function Tracks() {
    const [topTracks, setTopTracks] = useState<{ items: Track[] }>({ items: [] });
    const playlistId = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID || null;

    const fetchTopTracks = async (timeRange: 'short_term' | 'medium_term' | 'long_term') => {
        const tracks = await getUserItems("tracks", timeRange, 50, true, playlistId);
        setTopTracks(tracks);
    };

    useEffect(() => {
        fetchTopTracks('medium_term');
    }, []);

    return (
        <motion.main
            className={`main`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="title">Most Popular Tracks</h1>
                <p className="description">
                    Your most played songs.
                </p>

                <TimeRangeButtons onTimeRangeChange={fetchTopTracks} />

                <div className={styles.trackList}>
                    {topTracks.items.map((track, index) => (
                        <motion.div
                            key={index}
                            className={`card ${styles.trackCard}`}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15 }}
                            whileHover={{ scale: 1.02, x: 25 }}
                            onClick={() => window.open(`https://open.spotify.com/track/${track.id}`, "_blank")}
                        >
                            <div className={styles.trackInfo}>
                                <Image
                                    className={`image ${styles.trackImage}`}
                                    src={track?.album.images[0]?.url || '/placeholder-album.png'}
                                    alt={track?.name || 'Track'}
                                    width={80}
                                    height={80}
                                />
                                <div className={styles.trackDetails}>
                                    <h3>{track?.name}</h3>
                                    <p>{track.artists.map((artist: { name: string }) => artist.name).join(", ")}</p>
                                </div>
                            </div>
                            <div className={styles.trackRank}>#{index + 1}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.main>
    );
}
