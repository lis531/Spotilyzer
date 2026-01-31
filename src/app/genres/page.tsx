"use client";
import styles from "./genres.module.css";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { getUserTopGenres } from "@/utils/spotify";
import TimeRangeButtons from "@/components/TimeRangeButtons";
import type { TimeRange } from "@/types/spotify";

export default function Genres() {
    const [topGenres, setTopGenres] = useState<string[]>([]);

    const fetchTopGenres = async (timeRange: TimeRange) => {
        const genres = await getUserTopGenres(timeRange);
        setTopGenres(genres);
    };

    useEffect(() => {
        fetchTopGenres("medium_term");
    }, []);

    return (
        <motion.main className="main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <h1 className={`title ${styles.title}`}>Most Popular Genres*</h1>
            <p className={styles.disclaimer}>
                *Based on your top artists and tracks analyzed by Spotify
            </p>
            <p className="description">
                Discover your top music genres and explore new ones based on your listening habits.
            </p>

            <TimeRangeButtons onTimeRangeChange={fetchTopGenres} />

            <div className={`grid gridResponsive ${styles.genreGrid}`}>
                {topGenres.map((genre, index) => (
                    <motion.div
                        key={index}
                        className={`card ${styles.genreCard}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15 }}
                        whileHover={{ scale: 1.02, x: 10 }}
                    >
                        <div className={styles.genreInfo}>
                            <h3>{genre}</h3>
                            <p>#{index + 1}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.main>
    );
}
