"use client";
import styles from "./TimeRangeButtons.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface TimeRangeButtonsProps {
    onTimeRangeChange: (timeRange: 'short_term' | 'medium_term' | 'long_term') => void;
}

export default function TimeRangeButtons({ onTimeRangeChange }: TimeRangeButtonsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTimeRange = searchParams.get('timeRange') as 'short_term' | 'medium_term' | 'long_term' || 'medium_term';

    const handleTimeRangeChange = useCallback((timeRange: 'short_term' | 'medium_term' | 'long_term') => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('timeRange', timeRange);
        router.push(`?${params.toString()}`);
        onTimeRangeChange(timeRange);
    }, [router, searchParams, onTimeRangeChange]);

    return (
        <div className={styles.timeRangeButtons}>
            <button type="button" className={`${styles.timeRangeButton} card ${currentTimeRange === 'short_term' ? styles.active : ''}`} onClick={() => handleTimeRangeChange("short_term")}>
                Last 4 weeks
            </button>
            <button type="button" className={`${styles.timeRangeButton} card ${currentTimeRange === 'medium_term' ? styles.active : ''}`} onClick={() => handleTimeRangeChange("medium_term")}>
                Last 6 months
            </button>
            <button type="button" className={`${styles.timeRangeButton} card ${currentTimeRange === 'long_term' ? styles.active : ''}`} onClick={() => handleTimeRangeChange("long_term")}>
                Last 12 months
            </button>
        </div>
    );
}