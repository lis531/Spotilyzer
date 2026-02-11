import styles from './Dropdown.module.css';
import { getAllUserPlaylists } from '@/utils/spotify';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Playlist } from '@/types/spotify';

interface DropdownProps {
    onPlaylistSelect?: (playlistId: string) => void;
}

export default function Dropdown({ onPlaylistSelect }: DropdownProps) {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Playlist | null>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('selectedPlaylist');
            return saved ? JSON.parse(saved) : null;
        }
        return null;
    });
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const userPlaylists: Playlist[] = await getAllUserPlaylists();

                const likedSongsPlaylist: Playlist = {
                    id: 'liked-songs',
                    name: 'Liked Songs',
                    tracks: { items: [], next: null }
                };

                setPlaylists([likedSongsPlaylist, ...userPlaylists]);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };
        void fetchPlaylists();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    useEffect(() => {
        if (selected) {
            localStorage.setItem('selectedPlaylist', JSON.stringify(selected));
            onPlaylistSelect?.(selected.id);
            // Dispatch custom event to notify other components
            window.dispatchEvent(new Event('playlistChanged'));
        } else {
            localStorage.removeItem('selectedPlaylist');
        }
    }, [selected, onPlaylistSelect]);

    return (
        <div className={styles.dropdown} ref={dropdownRef}>
            <button className={styles.select} type="button" onClick={() => setOpen((v) => !v)}>
                {selected ? selected.name : 'Select a playlist'}
                <span className={styles.arrow} aria-hidden="true" />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.ul
                        className={styles.menu}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        tabIndex={-1}
                    >
                        {playlists.map((playlist) => (
                            <motion.li
                                key={playlist.id}
                                className={styles.option + (selected?.id === playlist.id ? ' ' + styles.selected : '')}
                                onClick={() => {
                                    setSelected(playlist);
                                    setOpen(false);
                                }}
                                role="option"
                                whileHover={{ backgroundColor: 'var(--overlay-green-light)' }}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.13 }}
                            >
                                {playlist.name}
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}