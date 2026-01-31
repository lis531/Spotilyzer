"use client";
import styles from "./home.module.css";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import DecadesPieChart from "@/components/DecadesPieChart";
import { useEffect, useState } from "react";
import React from "react";
import { getUserItems, getUserTopGenres, getTracksWithFeatures } from "@/utils/spotify";
import Moods from "@/components/Moods";
import type { Track, Artist } from "@/types/spotify";

export default function Home() {
  const { userInfo } = useAuth();

  const [topGenres, setTopGenres] = useState<string[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topTracksWithFeatures, setTopTracksWithFeatures] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setTopGenres(await getUserTopGenres('short_term'));
      const tracksResponse = await getUserItems('tracks', 'short_term');
      setTopTracks(tracksResponse.items || []);
      const artistsResponse = await getUserItems('artists', 'short_term');
      setTopArtists(artistsResponse.items || []);
      const tracksWithFeaturesResponse = await getTracksWithFeatures('short_term');
      setTopTracksWithFeatures(tracksWithFeaturesResponse.items || []);
    };
    fetchData();
  }, []);

  const decadesData = topTracks.reduce((acc, track) => {
    if (track?.album?.release_date) {
      const releaseYear = track.album.release_date.split("-")[0];
      const decade = `${Math.floor(Number(releaseYear) / 10) * 10}s`;
      acc[decade] = {
        count: (acc[decade]?.count || 0) + 1,
        topGenre: "Mixed" // add later
      };
    }
    return acc;
  }, {} as Record<string, { count: number; topGenre: string }>);

  const moodData = React.useMemo(() => {
    if (topTracksWithFeatures.length === 0) {
      return {
        avgHappiness: 0,
        avgDanceability: 0,
        avgEnergy: 0,
        avgAcousticness: 0,
        happiestTrack: null,
        danceablestTrack: null,
        mostEnergeticTrack: null,
        mostAcousticTrack: null,
      };
    }

    const tracksWithValidFeatures = topTracksWithFeatures.filter(
      track => track.audioFeatures && typeof track.audioFeatures === 'object'
    );

    if (tracksWithValidFeatures.length === 0) {
      return {
        avgHappiness: 0,
        avgDanceability: 0,
        avgEnergy: 0,
        avgAcousticness: 0,
        happiestTrack: null,
        danceablestTrack: null,
        mostEnergeticTrack: null,
        mostAcousticTrack: null,
      };
    }

    // Calculate averages
    const totals = tracksWithValidFeatures.reduce((acc, track) => {
      const features = track.audioFeatures!;
      return {
        valence: acc.valence + (features.valence || 0),
        danceability: acc.danceability + (features.danceability || 0),
        energy: acc.energy + (features.energy || 0),
        acousticness: acc.acousticness + (features.acousticness || 0),
      };
    }, { valence: 0, danceability: 0, energy: 0, acousticness: 0 });

    const count = tracksWithValidFeatures.length;
    
    // Find tracks with max values
    const happiestTrack = tracksWithValidFeatures.reduce((prev, curr) => {
      const prevValence = prev.audioFeatures?.valence || 0;
      const currValence = curr.audioFeatures?.valence || 0;
      return currValence > prevValence ? curr : prev;
    });

    const danceablestTrack = tracksWithValidFeatures.reduce((prev, curr) => {
      const prevDanceability = prev.audioFeatures?.danceability || 0;
      const currDanceability = curr.audioFeatures?.danceability || 0;
      return currDanceability > prevDanceability ? curr : prev;
    });

    const mostEnergeticTrack = tracksWithValidFeatures.reduce((prev, curr) => {
      const prevEnergy = prev.audioFeatures?.energy || 0;
      const currEnergy = curr.audioFeatures?.energy || 0;
      return currEnergy > prevEnergy ? curr : prev;
    });

    const mostAcousticTrack = tracksWithValidFeatures.reduce((prev, curr) => {
      const prevAcousticness = prev.audioFeatures?.acousticness || 0;
      const currAcousticness = curr.audioFeatures?.acousticness || 0;
      return currAcousticness > prevAcousticness ? curr : prev;
    });

    return {
      avgHappiness: Math.round((totals.valence / count) * 100),
      avgDanceability: Math.round((totals.danceability / count) * 100),
      avgEnergy: Math.round((totals.energy / count) * 100),
      avgAcousticness: Math.round((totals.acousticness / count) * 100),
      happiestTrack,
      danceablestTrack,
      mostEnergeticTrack,
      mostAcousticTrack,
    };
  }, [topTracksWithFeatures]);

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

        <Moods moodData={moodData} />

        <div className={styles.decadesContainer}>
          <h1 className={styles.h2}>By Decades</h1>
          <div className={styles.headerLine}></div>
          <div className={styles.pieChartContainer}>
            <DecadesPieChart data={Object.entries(decadesData).map(([decade, { count }]) => ({ decade, count }))}
            />
          </div>
          <div className={styles.decadesGrid}>
            {Object.entries(decadesData).map(([decade, data]) => (
              <div key={decade} className={`card ${styles.decadeCard}`}>
                <h3 className={styles.h3}>{decade}</h3>
                <p className={styles.text}>Tracks: {data.count}</p>
                {/* <p className={styles.text}>Top Genre: {data.topGenre}</p> */}
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
