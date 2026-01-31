"use client";
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './DecadesPieChart.module.css';
import { Geist } from "next/font/google";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DecadeData {
  decade: string;
  count: number;
}

interface DecadesPieChartProps {
  data: DecadeData[];
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const DecadesPieChart: React.FC<DecadesPieChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className={styles.noData}>No decade data available</div>;
  }

  const colors = [
    '#1db954',
    '#1ed760',
    '#4ac776',
    '#6bd88a',
    '#8ce99a',
    '#b2f2bb',
    '#d3f9d8',
    '#e6fcf5',
  ];

  const chartData = {
    labels: data.map(item => item.decade),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: colors.slice(0, data.length),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverBackgroundColor: colors.map(color => color + '80'),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
            family: geistSans.style.fontFamily,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#191414',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#1db954',
        borderWidth: 1,
        titleFont: {
          size: 14,
          family: geistSans.style.fontFamily,
        },
        bodyFont: {
          size: 12,
          family: geistSans.style.fontFamily,
        },
        callbacks: {
          label: function (context: { label: string; parsed: number }) {
            const decade = context.label;
            const count = context.parsed;
            const total = data.reduce((sum, item) => sum + item.count, 0);
            const percentage = ((count / total) * 100).toFixed(1);
            return `${decade}: ${count} tracks (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DecadesPieChart;
