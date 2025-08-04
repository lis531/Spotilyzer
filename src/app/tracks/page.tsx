"use client";
import styles from "./tracks.module.css";
import { motion } from "framer-motion";

export default function Tracks() {
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
                        Your most played songs and current favorites.
                    </p>

                    <div className={styles.trackList}>
                        {[1, 2, 3, 4, 5].map((index) => (
                            <motion.div
                                key={index}
                                className={`card ${styles.trackCard}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                                whileHover={{ scale: 1.02, x: 10 }}
                            >
                                <div className={styles.trackInfo}>
                                    <div className={`image ${styles.trackImage}`}></div>
                                    <div className={styles.trackDetails}>
                                        <h3>Track Name {index}</h3>
                                        <p>Artist Name</p>
                                        <span className={styles.playCount}>{150 - index * 20} plays</span>
                                    </div>
                                </div>
                                <div className={styles.trackRank}>#{index}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.main>
    );
}
