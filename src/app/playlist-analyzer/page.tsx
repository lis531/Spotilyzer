"use client";
import React, { useState, useEffect } from "react";
import styles from "./playlist-analyzer.module.css";
import { motion } from "framer-motion";
import Dropdown from "@/components/Dropdown";

export default function PlaylistAnalyzer() {
    return (
        <motion.main
            className={`main`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <h1 className="title">Playlist Analyzer</h1>
            <p className="description">
                Analyze your Spotify playlists to gain insights into your music preferences.
            </p>
            <Dropdown />
        </motion.main>
    );
}