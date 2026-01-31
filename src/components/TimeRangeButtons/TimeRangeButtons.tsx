"use client";
import styles from "./TimeRangeButtons.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { TimeRange } from "@/types/spotify";

interface TimeRangeButtonsProps {
    onTimeRangeChange: (timeRange: TimeRange) => void;
}

export default function TimeRangeButtons({ onTimeRangeChange }: TimeRangeButtonsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTimeRange = (searchParams.get('timeRange') as TimeRange) || 'medium_term';

    const handleTimeRangeChange = useCallback((timeRange: TimeRange) => {
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