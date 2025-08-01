"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [showPopular, setShowPopular] = useState(false);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Spotilyzer</h1>
        <p className={styles.description}>
          Analyze your Spotify listening habits and discover new music.
        </p>
        <nav className={styles.nav}>
          <a href="#">Home</a>
          <button className={styles.button} onClick={() => setShowPopular(!showPopular)}>Most popular</button>
          <AnimatePresence>
            {showPopular && (
              <motion.ul
                className={styles.dropdownList}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ 
                  duration: 0.3, 
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                style={{ overflow: "hidden" }}
              >
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  <a href="#genres">Genres</a>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                >
                  <a href="#artists">Artists</a>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                >
                  <a href="#tracks">Tracks</a>
                </motion.li>
              </motion.ul>
            )}
          </AnimatePresence>
          <a href="#contact">Contact</a>
        </nav>
        <h1 className={styles.h1}>
          Discover Your Music Journey
        </h1>
        <p className={styles.text}>
          Dive deep into your Spotify data to uncover trends, favorite genres, and more.
        </p>
        <h1 className={styles.h1}>
          Your Moods
        </h1>
        <h2 className={styles.h2}>
          Happiness
        </h2>
        <p className={styles.text}>
          Favorite song:
        </p>
        <h2 className={styles.h2}>
          Danceability
        </h2>
        <h2 className={styles.h2}>
          Energy
        </h2>
        <h2 className={styles.h2}>
          Acousticness
        </h2>
        <p className={styles.text}>
          <strong>Disclaimer:</strong> This application is not affiliated with Spotify.
        </p>
        <p className={styles.footer}>
          Borys Gajewski &copy; {new Date().getFullYear()} - All rights reserved.
        </p>
      </main>
    </div>
  );
}
