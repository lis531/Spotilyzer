"use client";
import { motion } from "framer-motion";
import styles from "./artists.module.css";
import React, { useState, useEffect } from "react";
import { getTopArtists } from "@/utils/spotify";
import Image from "next/image";
import TimeRangeButtons from "../components/TimeRangeButtons/TimeRangeButtons";

interface Artist {
  name: string;
  images: { url: string }[];
  followers: { total: number };
}

export default function Artists() {
  const [topArtists, setTopArtists] = useState<{ items: Artist[] }>({ items: [] });

    const fetchTopArtists = async (timeRange: 'short_term' | 'medium_term' | 'long_term') => {
        const artists = await getTopArtists(timeRange);
        setTopArtists(artists);
    };

    useEffect(() => {
        fetchTopArtists("medium_term");
    }, []);


  return (
    <motion.main
      className="main"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
          <h1 className="title">Most Popular Artists</h1>
          <p className="description">
            Your top artists based on listening frequency and time spent.
          </p>

          <TimeRangeButtons onTimeRangeChange={fetchTopArtists} />

          <div className={`grid gridResponsive`}>
            {topArtists.items.map((artist, index) => (
              <motion.div
                key={index}
                className={`card ${styles.artistCard}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
                whileHover={{ scale: 1.02 }}
              >
                <Image 
                  className={`image imageCircle ${styles.artistImage}`} 
                  src={artist.images[0]?.url || '/placeholder-artist.png'} 
                  alt={artist.name}
                  width={200}
                  height={200}
                />
                <h3>{artist.name}</h3>
                <p>{artist.followers.total} followers</p>
                <span className={`rank ${styles.rank}`}>#{index + 1}</span>
              </motion.div>
            ))}
          </div>
        </motion.main>
  );
}
