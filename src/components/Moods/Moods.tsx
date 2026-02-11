"use client";
import styles from "./Moods.module.css";
import type { MoodData } from "@/types/spotify";

export default function Moods({ moodData }: { moodData: MoodData }) {
    return (
        <div className={styles.moodsContainer}>
            <h1 className={styles.h1}>
                Your Moods
            </h1>
            <div className={styles.headerLine}></div>
            <div className={styles.moodGrid}>
                <div className={`card ${styles.moodCard}`}>
                    <h2 className={styles.h2}>Happiness</h2>
                    <progress value={moodData.avgHappiness} max={100} />
                    <p className={styles.description}>Mostly upbeat, positive songs.</p>
                    <div className={styles.songSection}>
                        <b>Happiest:</b>
                        <p>{moodData.happiestTrack?.name}</p>
                    </div>
                </div>
                <div className={`card ${styles.moodCard}`}>
                    <h2 className={styles.h2}>Danceability</h2>
                    <progress value={moodData.avgDanceability} max={100} />
                    <p className={styles.description}>Great for dancing and moving.</p>
                    <div className={styles.songSection}>
                        <b>Most danceable:</b>
                        <p>{moodData.danceablestTrack?.name}</p>
                    </div>
                </div>
                <div className={`card ${styles.moodCard}`}>
                    <h2 className={styles.h2}>Energy</h2>
                    <progress value={moodData.avgEnergy} max={100} />
                    <p className={styles.description}>High energy tracks to keep you moving.</p>
                    <div className={styles.songSection}>
                        <b>Most energetic:</b>
                        <p>{moodData.mostEnergeticTrack?.name}</p>
                    </div>
                </div>
                <div className={`card ${styles.moodCard}`}>
                    <h2 className={styles.h2}>Acousticness</h2>
                    <progress value={moodData.avgAcousticness} max={100} />
                    <p className={styles.description}>Soft and calming acoustic tracks.</p>
                    <div className={styles.songSection}>
                        <b>Most acoustic:</b>
                        <p>{moodData.mostAcousticTrack?.name}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
