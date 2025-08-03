"use client";
import styles from "./artists.module.css";
import { motion } from "framer-motion";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function Artists() {
    return (
        <div className="page">
            <Navigation />
            <motion.main className="main"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <h1 className="title">Most Popular Artists</h1>
                <p className="description">
                    Your top artists based on listening frequency and time spent.
                </p>

                <div className={`grid gridResponsive ${styles.artistGrid}`}>
                    <motion.div
                        className={`card ${styles.artistCard}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.15 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className={`image imageCircle ${styles.artistImage}`}></div>
                        <h3>Artist Name 1</h3>
                        <p>152 plays this month</p>
                        <span className={`rank ${styles.rank}`}>#1</span>
                    </motion.div>

                    <motion.div
                        className={`card ${styles.artistCard}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.15 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className={`image imageCircle ${styles.artistImage}`}></div>
                        <h3>Artist Name 2</h3>
                        <p>128 plays this month</p>
                        <span className={`rank ${styles.rank}`}>#2</span>
                    </motion.div>

                    <motion.div
                        className={`card ${styles.artistCard}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.15 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className={`image imageCircle ${styles.artistImage}`}></div>
                        <h3>Artist Name 3</h3>
                        <p>95 plays this month</p>
                        <span className={`rank ${styles.rank}`}>#3</span>
                    </motion.div>
                </div>
            </motion.main>
            <Footer />
        </div>
    );
}
