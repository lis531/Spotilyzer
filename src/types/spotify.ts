// Shared TypeScript interfaces for Spotify data structures

export interface Track {
	id: string;
	name: string;
	artists: { name: string }[];
	album: {
		release_date: string;
		images: { url: string }[];
	};
	external_ids?: {
		isrc?: string;
	};
	playcount?: number;
	popularity?: number;
	audioFeatures?: AudioFeatures;
}

export interface AudioFeatures {
	valence?: number;
	danceability?: number;
	energy?: number;
	acousticness?: number;
	tempo?: number;
	loudness?: number;
	speechiness?: number;
	instrumentalness?: number;
	liveness?: number;
	[key: string]: any;
}

export interface Artist {
	id: string;
	name: string;
	images: { url: string }[];
	followers: { total: number };
	genres?: string[];
}

export interface Playlist {
	id: string;
	name: string;
	tracks: {
		items: Track[];
		next: string | null;
	};
}

export type TimeRange = "short_term" | "medium_term" | "long_term";
