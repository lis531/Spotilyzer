"use client";
import styles from "./home.module.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

export default function Home() {

  return (
    <div className="page">
      <Navigation />
      <main className="main">
        <h1 className="title">Welcome to Spotilyzer</h1>
        <p className="description">
          Analyze your Spotify listening habits and discover new music.
        </p>
        <section className={styles.content}>
          <h1 className={styles.h1}>
            Discover Your Music Journey
          </h1>
          <p className={styles.text}>
            Dive deep into your Spotify data to uncover trends, favorite genres, and more.
          </p>
          
          <div className={styles.moodsSection}>
            <h1 className={styles.h1}>
              Your Moods
            </h1>
            <div className={styles.moodGrid}>
              <div className={`card ${styles.moodCard}`}>
                <h2 className={styles.h2}>Happiness</h2>
                <p className={styles.text}>Favorite song:</p>
              </div>
              <div className={`card ${styles.moodCard}`}>
                <h2 className={styles.h2}>Danceability</h2>
              </div>
              <div className={`card ${styles.moodCard}`}>
                <h2 className={styles.h2}>Energy</h2>
              </div>
              <div className={`card ${styles.moodCard}`}>
                <h2 className={styles.h2}>Acousticness</h2>
              </div>
            </div>
          </div>
          
          <p className={styles.disclaimer}>
            <strong>Disclaimer:</strong> This application is not affiliated with Spotify.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
