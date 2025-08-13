"use client";
import styles from "./home.module.css";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import DecadesPieChart from "@/components/DecadesPieChart";

export default function Home() {
  const { userInfo } = useAuth();

  // Sample data for the decades pie chart
  const decadesData = [
    { decade: "2020s", count: 145, topGenre: "Pop" },
    { decade: "2010s", count: 298, topGenre: "Hip-Hop" },
    { decade: "2000s", count: 187, topGenre: "Rock" },
    { decade: "1990s", count: 132, topGenre: "R&B" },
    { decade: "1980s", count: 89, topGenre: "Synth-pop" },
    { decade: "1970s", count: 45, topGenre: "Classic Rock" },
  ];

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
          <div className={styles.headerLine}></div>
          <div className={styles.summaryGrid}>
            <div className={`card ${styles.summaryCard}`}>
              <h2>Top Tracks (This Month)</h2>
              <ol>
                <li>1. Track</li>
                <li className={styles.line}></li>
                <li>2. Track</li>
                <li className={styles.line}></li>
                <li>3. Track</li>
                <li className={styles.line}></li>
                <li>4. Track</li>
                <li className={styles.line}></li>
                <li>5. Track</li>
              </ol>
            </div>
            <div className={`card ${styles.summaryCard}`}>
              <h2>Top Artists (This Month)</h2>
              <ol>
                <li>1. Artist 1</li>
                <li className={styles.line}></li>
                <li>2. Artist 2</li>
                <li className={styles.line}></li>
                <li>3. Artist 3</li>
                <li className={styles.line}></li>
                <li>4. Artist 4</li>
                <li className={styles.line}></li>
                <li>5. Artist 5</li>
              </ol>
            </div>
            <div className={`card ${styles.summaryCard}`}>
              <h2>Top Genres (This Month)</h2>
              <ol>
                <li>1. Genre 1</li>
                <li className={styles.line}></li>
                <li>2. Genre 2</li>
                <li className={styles.line}></li>
                <li>3. Genre 3</li>
                <li className={styles.line}></li>
                <li>4. Genre 4</li>
                <li className={styles.line}></li>
                <li>5. Genre 5</li>
              </ol>
            </div>
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
          <div className={styles.headerLine}></div>
          <div className={styles.moodGrid}>
            <div className={`card ${styles.moodCard}`}>
              <h2 className={styles.h2}>Happiness</h2>
              <progress value={70} max={100} />
              <p className={styles.description}>Mostly upbeat, positive songs.</p>
              <div className={styles.songSection}>
                <b>Happiest:</b>
                <p>Happy Song Title</p>
              </div>
            </div>
            <div className={`card ${styles.moodCard}`}>
              <h2 className={styles.h2}>Danceability</h2>
              <progress value={80} max={100} />
              <p className={styles.description}>Great for dancing and moving.</p>
              <div className={styles.songSection}>
                <b>Most danceable:</b>
                <p>Danceable Song Title</p>
              </div>
            </div>
            <div className={`card ${styles.moodCard}`}>
              <h2 className={styles.h2}>Energy</h2>
              <progress value={90} max={100} />
              <p className={styles.description}>High energy tracks to keep you moving.</p>
              <div className={styles.songSection}>
                <b>Most energetic:</b>
                <p>Energetic Song Title</p>
              </div>
            </div>
            <div className={`card ${styles.moodCard}`}>
              <h2 className={styles.h2}>Acousticness</h2>
              <progress value={60} max={100} />
              <p className={styles.description}>Soft and calming acoustic tracks.</p>
              <div className={styles.songSection}>
                <b>Most acoustic:</b>
                <p>Acoustic Song Title</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.decadesContainer}>
          <h1 className={styles.h2}>By Decades</h1>
          <div className={styles.headerLine}></div>
          <div className={styles.pieChartContainer}>
            <DecadesPieChart data={decadesData} />
          </div>
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
