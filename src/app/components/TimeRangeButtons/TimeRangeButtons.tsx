"use client";
import styles from "./TimeRangeButtons.module.css";

interface TimeRangeButtonsProps {
    onTimeRangeChange: (timeRange: 'short_term' | 'medium_term' | 'long_term') => void;
}

export default function TimeRangeButtons({ onTimeRangeChange }: TimeRangeButtonsProps) {
    return (
        <div className={styles.timeRangeButtons}>
            <button className={`${styles.timeRangeButton} card`} onClick={() => onTimeRangeChange("short_term")}>Last 4 weeks</button>
            <button className={`${styles.timeRangeButton} card`} onClick={() => onTimeRangeChange("medium_term")}>Last 6 months</button>
            <button className={`${styles.timeRangeButton} card`} onClick={() => onTimeRangeChange("long_term")}>Last 12 months</button>
        </div>
    );
}