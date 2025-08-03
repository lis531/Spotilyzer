"use client";
import styles from "./genres.module.css";
import { motion } from "framer-motion";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function Genres() {
    return (
        <div className="page">
            <Navigation />
            <motion.main className="main"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <h1 className="title">Most Popular Genres</h1>
                <p className="description">
                    Discover your top music genres and explore new ones based on your listening habits.
                </p>

                <div className={`grid gridResponsive ${styles.genreGrid}`}>
                    <motion.div
                        className={styles.genreCard}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <h3>Pop</h3>
                        <p>45% of your listening time</p>
                    </motion.div>

                    <motion.div
                        className={styles.genreCard}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <h3>Rock</h3>
                        <p>32% of your listening time</p>
                    </motion.div>

                    <motion.div
                        className={styles.genreCard}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <h3>Electronic</h3>
                        <p>23% of your listening time</p>
                    </motion.div>
                </div>
            </motion.main>
            <Footer />
        </div>
    );
}
