"use client";
import styles from "./home.module.css";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { userInfo } = useAuth();

  return (
    <motion.main
      className="main"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
          <div className={styles.headerContainer}>
            <div>
              <h1 className="title">
                Welcome to Spotilyzer{userInfo?.display_name ? `, ${userInfo.display_name}` : ''}
              </h1>
              <p className="description">
                Analyze your Spotify listening habits and discover new music.
              </p>
            </div>
          </div>
          <section className={styles.content}>
            <h1 className={styles.h1}>
              Discover Your Music Journey
            </h1>
            <p className={styles.text}>
              Dive deep into your Spotify data to uncover trends, favorite genres, and more.
            </p>

            <div className={styles.summaryContainer}>
              <h1 className={styles.h1}>
                Your Quick Summary
              </h1>
              <div className={`card`}>
                <h2>Top Tracks (This Month)</h2>
                <ol>
                  <li>Track 1</li>
                  <li>Track 1</li>
                  <li>Track 1</li>
                  <li>Track 1</li>
                  <li>Track 1</li>
                </ol>
              </div>

            </div>

            {/* energy
            tempo
            valence
            danceability
            instrumentalness
            speechiness*/}
            <div className={styles.moodsContainer}>
              <h1 className={styles.h1}>
                Your Moods
              </h1>
              <div className={styles.moodGrid}>
                <div className={`card ${styles.moodCard}`}>
                  <h2 className={styles.h2}>Happiness</h2>
                  <progress value={70} max={100} />
                  <p className={styles.description}>Mostly upbeat, positive songs.</p>
                  <b>Happiest:</b>
                  <p>Happy Song Title</p>
                </div>
                <div className={`card ${styles.moodCard}`}>
                  <h2 className={styles.h2}>Danceability</h2>
                  <progress value={80} max={100} />
                  <p className={styles.description}>Great for dancing and moving.</p>
                  <b>Most danceable:</b>
                  <p>Danceable Song Title</p>
                </div>
                <div className={`card ${styles.moodCard}`}>
                  <h2 className={styles.h2}>Energy</h2>
                  <progress value={90} max={100} />
                  <p className={styles.description}>High energy tracks to keep you moving.</p>
                  <b>Most energetic:</b>
                  <p>Energetic Song Title</p>
                </div>
                <div className={`card ${styles.moodCard}`}>
                  <h2 className={styles.h2}>Acousticness</h2>
                  <progress value={60} max={100} />
                  <p className={styles.description}>Soft and calming acoustic tracks.</p>
                  <b>Most acoustic:</b>
                  <p>Acoustic Song Title</p>
                </div>
              </div>
            </div>
            <div className={styles.decadesContainer}>
              <h2 className={styles.h2}>By decades</h2>
              {/* pie chart */}
              <div className={styles.pieChartContainer}>
                <div className={styles.pieChart}></div>
              </div>
              {/* divs for decades */}
              <div className={styles.decadesGrid}>
                <div className={`card ${styles.decadesCard}`}>
                  <h3 className={styles.h3}>2020s</h3>
                  <p className={styles.text}>Top genre: Pop</p>
                </div>
                <div className={`card ${styles.decadesCard}`}>
                  <h3 className={styles.h3}>2010s</h3>
                  <p className={styles.text}>Top genre: Hip-Hop</p>
                </div>
                <div className={`card ${styles.decadesCard}`}>
                  <h3 className={styles.h3}>2000s</h3>
                  <p className={styles.text}>Top genre: Rock</p>
                </div>
                <div className={`card ${styles.decadesCard}`}>
                  <h3 className={styles.h3}>1990s</h3>
                  <p className={styles.text}>Top genre: R&B</p>
                </div>
                <div className={`card ${styles.decadesCard}`}>
                  <h3 className={styles.h3}>1980s</h3>
                  <p className={styles.text}>Top genre: Synth-pop</p>
                </div>
              </div>
            </div>
            <p className={styles.disclaimer}>
              <strong>Disclaimer:</strong> This application is not affiliated with Spotify.
            </p>
          </section>
        </motion.main>
  );
}
