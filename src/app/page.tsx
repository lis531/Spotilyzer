"use client";
import styles from "./home.module.css";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import DecadesPieChart from "@/components/DecadesPieChart";
import { Fragment, useEffect, useMemo, useState } from "react";
import { getUserItems, getUserTopGenres, getTracksWithFeatures } from "@/utils/spotify";
import Moods from "@/components/Moods";
import type { Track, Artist } from "@/types/spotify";
import summaryStyles from "@/styles/summary.module.css";

export default function Home() {
  const { userInfo } = useAuth();

  const [topGenres, setTopGenres] = useState<string[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topTracksWithFeatures, setTopTracksWithFeatures] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [genres, tracksResponse, artistsResponse, tracksWithFeaturesResponse] = await Promise.all([
        getUserTopGenres('short_term'),
        getUserItems('tracks', 'short_term'),
        getUserItems('artists', 'short_term'),
        getTracksWithFeatures('short_term'),
      ]);
      setTopGenres(genres);
      setTopTracks(tracksResponse.items);
      setTopArtists(artistsResponse.items);
      setTopTracksWithFeatures(tracksWithFeaturesResponse.items);
    };
    void fetchData();
  }, []);

  const decadesData = topTracks.reduce((acc, track) => {
    const releaseYear = track.album.release_date.split("-")[0];
    const decade = `${Math.floor(Number(releaseYear) / 10) * 10}s`;
    acc[decade] = {
      count: (acc[decade]?.count || 0) + 1,
      topGenre: "Mixed",
    };
    return acc;
  }, {} as Record<string, { count: number; topGenre: string }>);

  const moodData = useMemo(() => {
    const emptyMood = {
      avgHappiness: 0,
      avgDanceability: 0,
      avgEnergy: 0,
      avgAcousticness: 0,
      happiestTrack: null,
      danceablestTrack: null,
      mostEnergeticTrack: null,
      mostAcousticTrack: null,
    };

    if (topTracksWithFeatures.length === 0) return emptyMood;

    const tracksWithValidFeatures = topTracksWithFeatures.filter(
      track => track.audioFeatures
    );

    if (tracksWithValidFeatures.length === 0) return emptyMood;

    const totals = tracksWithValidFeatures.reduce((acc, track) => {
      const features = track.audioFeatures!;
      return {
        valence: acc.valence + (features.valence ?? 0),
        danceability: acc.danceability + (features.danceability ?? 0),
        energy: acc.energy + (features.energy ?? 0),
        acousticness: acc.acousticness + (features.acousticness ?? 0),
      };
    }, { valence: 0, danceability: 0, energy: 0, acousticness: 0 });

    const count = tracksWithValidFeatures.length;
    const maxBy = (key: keyof NonNullable<Track["audioFeatures"]>) =>
      tracksWithValidFeatures.reduce((prev, curr) =>
        (curr.audioFeatures?.[key] ?? 0) > (prev.audioFeatures?.[key] ?? 0) ? curr : prev
      );

    return {
      avgHappiness: Math.round((totals.valence / count) * 100),
      avgDanceability: Math.round((totals.danceability / count) * 100),
      avgEnergy: Math.round((totals.energy / count) * 100),
      avgAcousticness: Math.round((totals.acousticness / count) * 100),
      happiestTrack: maxBy("valence"),
      danceablestTrack: maxBy("danceability"),
      mostEnergeticTrack: maxBy("energy"),
      mostAcousticTrack: maxBy("acousticness"),
    };
  }, [topTracksWithFeatures]);

  const summaryCards = [
    {
      title: "Top Tracks (This Month)",
      items: topTracks,
      getLabel: (track: Track) => `${track.name} - ${track.artists.map(artist => artist.name).join(", ")}`,
    },
    {
      title: "Top Artists (This Month)",
      items: topArtists,
      getLabel: (artist: Artist) => artist.name,
    },
    {
      title: "Top Genres (This Month)",
      items: topGenres,
      getLabel: (genre: string) => genre,
    },
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
        <h1 className={summaryStyles.h1}>
          Discover Your Music Journey
        </h1>
        <p className={styles.text}>
          Dive deep into your Spotify data to uncover trends, favorite genres, and more.
        </p>

        <div className={summaryStyles.summaryContainer}>
          <h1 className={summaryStyles.h1}>
            Your Quick Summary
          </h1>
          <div className={summaryStyles.headerLine}></div>
          <div className={summaryStyles.summaryGrid}>
            {summaryCards.map((card) => (
              <div key={card.title} className={`card ${summaryStyles.summaryCard}`}>
                <h2>{card.title}</h2>
                <ol>
                  {card.items.slice(0, 5).map((item, index) => (
                    <Fragment key={index}>
                      <li>{`${index + 1}. ${card.getLabel(item as Track & Artist & string)}`}</li>
                      {index !== 4 && <li className={summaryStyles.line}></li>}
                    </Fragment>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        <Moods moodData={moodData} />

        <div className={summaryStyles.decadesContainer}>
          <h1 className={summaryStyles.h2}>By Decades</h1>
          <div className={summaryStyles.headerLine}></div>
          <div className={summaryStyles.pieChartContainer}>
            <DecadesPieChart data={Object.entries(decadesData).map(([decade, { count }]) => ({ decade, count }))}
            />
          </div>
          <div className={summaryStyles.decadesGrid}>
            {Object.entries(decadesData).map(([decade, data]) => (
              <div key={decade} className={`card ${summaryStyles.decadeCard}`}>
                <h3 className={styles.h3}>{decade}</h3>
                <p className={styles.text}>Tracks: {data.count}</p>
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
