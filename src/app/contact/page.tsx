"use client";
import styles from "./contact.module.css";
import { motion } from "framer-motion";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function Contact() {
    return (
        <div className="page">
            <Navigation />
            <motion.main
                className={`main`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                <div
                    className={styles.container}
                >
                    <h1 className="title">Contact Me</h1>
                    <motion.button
                        className={`button ${styles.contactButton}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = "https://github.com/lis531"}
                    >
                        Github
                    </motion.button>
                    <motion.button
                        className={`button ${styles.contactButton}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = "https://x.com/Lisu22361857"}
                    >
                        Twitter
                    </motion.button>
                    <motion.button
                        className={`button ${styles.contactButton}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = "mailto:borys.gajewski7@gmail.com"}
                    >
                        Email
                    </motion.button>
                </div>
            </motion.main>
            <Footer />
        </div>
    );
}
