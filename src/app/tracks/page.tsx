"use client";
import React, { useState, useEffect } from "react";
import styles from "./tracks.module.css";
import { motion } from "framer-motion";
import { getUserTopItems } from "@/utils/spotify";
import Image from "next/image";
import TimeRangeButtons from "../components/TimeRangeButtons/TimeRangeButtons";

interface Track {
    name: string;
    artists: { name: string }[];
    album: {
        images: { url: string }[];
    };
    playcount?: number;
    popularity?: number;
    danceability?: number;
}

export default function Tracks() {
    const [topTracks, setTopTracks] = useState<{ items: Track[] }>({ items: [] });

    const fetchTopTracks = async (timeRange: 'short_term' | 'medium_term' | 'long_term') => {
        const tracks = await getUserTopItems("tracks", timeRange);
        setTopTracks(tracks);
    }

    useEffect(() => {
        fetchTopTracks("medium_term");
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
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.07, duration: 0.3 }}
                                whileHover={{ scale: 1.02, x: 10 }}
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
                                        <span className={styles.playCount}>{track?.playcount} plays</span>
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
