import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Spotilyzer</h1>
        <p className={styles.description}>
          Analyze your Spotify listening habits and discover new music.
        </p>
        <nav className={styles.nav}>
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <select title="Most popular">
                <option value="genres">Genres</option>
                <option value="artists">Artists</option>
                <option value="tracks">Tracks</option>
              </select>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </nav>
        <p className={styles.footer}>
          Borys Gajewski &copy; {new Date().getFullYear()} - All rights reserved.
        </p>
      </main>
    </div>
  );
}
