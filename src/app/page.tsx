"use client";
import styles from "./home.module.css";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import DecadesPieChart from "@/components/DecadesPieChart";
import { useEffect, useState } from "react";
import React from "react";
import { getUserTopItems, getUserTopGenres } from "@/utils/spotify";

interface Track {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
        images: { url: string }[];
        release_date: string;
        total_tracks: number;
    };
    playcount?: number;
    popularity?: number;
    danceability?: number;
}

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  followers: { total: number };
}

export default function Home() {
  const { userInfo } = useAuth();

  const [topGenres, setTopGenres] = useState<string[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setTopGenres(await getUserTopGenres('short_term'));
      const tracksResponse = await getUserTopItems('tracks', 'short_term');
      setTopTracks(tracksResponse.items || []);
      const artistsResponse = await getUserTopItems('artists', 'short_term');
      setTopArtists(artistsResponse.items || []);
    };

    fetchData();
  }, []);

  const decadesData = topTracks.reduce((acc, track) => {
    if (track?.album?.release_date) {
      const releaseYear = track.album.release_date.split("-")[0];
      const decade = `${Math.floor(Number(releaseYear) / 10) * 10}s`;
      acc[decade] = {
        count: (acc[decade]?.count || 0) + 1,
        topGenre: "Mixed" // Maybe add later
      };
    }
    return acc;
  }, {} as Record<string, { count: number; topGenre: string }>);

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
                {topTracks.map((track, index) => {
                  if (index >= 5) return null;
                  return (
                    <React.Fragment key={track.id}>
                      <li>{`${index + 1}. ${track.name} - ${track.artists.map(artist => artist.name).join(", ")}`}</li>
                      {index != 4 && <li className={styles.line}></li>}
                    </React.Fragment>
                  );
                })}
              </ol>
            </div>
            <div className={`card ${styles.summaryCard}`}>
              <h2>Top Artists (This Month)</h2>
              <ol>
                {topArtists.map((artist, index) => {
                  if (index >= 5) return null;
                  return (
                    <React.Fragment key={artist.id}>
                      <li>{`${index + 1}. ${artist.name}`}</li>
                      {index != 4 && <li className={styles.line}></li>}
                    </React.Fragment>
                  );
                })}
              </ol>
            </div>
            <div className={`card ${styles.summaryCard}`}>
              <h2>Top Genres (This Month)</h2>
              <ol>
                {topGenres.map((genre, index) => {
                  if (index >= 5) return null;
                  return (
                    <React.Fragment key={genre}>
                      <li>{`${index + 1}. ${genre}`}</li>
                      {index != 4 && <li className={styles.line}></li>}
                    </React.Fragment>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>

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
            <DecadesPieChart data={Object.entries(decadesData).map(([decade, { count, topGenre }]) => ({ decade, count, topGenre }))}
            />
          </div>
          <div className={styles.decadesGrid}>
            {Object.entries(decadesData).map(([decade, data]) => (
              <div key={decade} className={`card ${styles.decadeCard}`}>
                <h3 className={styles.h3}>{decade}</h3>
                <p className={styles.text}>Tracks: {data.count}</p>
                <p className={styles.text}>Top Genre: {data.topGenre}</p>
              </div>
            ))}
          </div>
        </div>
        <p className={styles.disclaimer}>
          <strong>Disclaimer:</strong> This application is not affiliated with Spotify.
        </p>
      </section>
    </motion.main>
  );
}
