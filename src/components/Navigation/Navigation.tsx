"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";
import { logout } from "@/utils/spotify";
import { useAuth } from "@/hooks/useAuth";

const DROPDOWN_PAGES = [{ path: '/tracks', name: 'Tracks' }, { path: '/genres', name: 'Genres' }, { path: '/artists', name: 'Artists' }] as const;

export default function Navigation() {
    const [showPopular, setShowPopular] = useState(false);
    const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0 });
    const [isInitialRender, setIsInitialRender] = useState(true);
    const pathname = usePathname();
    const { isLoggedIn, loading } = useAuth();
    const navRef = useRef<HTMLDivElement>(null);

    const isDropdownPage = DROPDOWN_PAGES.some(page => page.path === pathname);
    const shouldHighlightDropdown = isDropdownPage || showPopular;

    const handleClickOutside = (event: MouseEvent) => {
        if (!(event.target instanceof Element) || !event.target.closest(`.${styles.dropdownContainer}`)) {
            setShowPopular(false);
        }
    };

    const handleLogout = () => {
        logout();
        window.location.reload();
    };

    const updateHighlight = () => {
        if (!navRef.current) return;

        let activeTab = '';
        if (shouldHighlightDropdown) activeTab = 'dropdown';
        else if (pathname === '/') activeTab = 'home';
        else if (pathname === '/playlist-analyzer') activeTab = 'playlist';
        else if (pathname === '/contact') activeTab = 'contact';

        if (!activeTab) return;

        const activeElement = navRef.current.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
        if (!activeElement) return;

        const navRect = navRef.current.getBoundingClientRect();
        const activeRect = activeElement.getBoundingClientRect();

        setHighlightStyle({
            left: activeRect.left - navRect.left,
            width: activeRect.width
        });
        
        if (isInitialRender) {
            setIsInitialRender(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn && !loading) {
            updateHighlight();
            const timer = setTimeout(updateHighlight, 200);
            return () => clearTimeout(timer);
        }
    }, [pathname, showPopular, isLoggedIn, loading]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    if (!isLoggedIn || loading) return null;

    return (
        <motion.nav
            ref={navRef}
            className={styles.nav}
            initial={{ y: -25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <div className={styles.linkContainer} data-tab="home">
                <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>
                    Home
                </Link>
            </div>

            <div className={styles.dropdownContainer}>
                <div className={styles.linkContainer} data-tab="dropdown">
                    <button className={`${styles.button} ${shouldHighlightDropdown ? styles.active : ''}`} onClick={() => setShowPopular(!showPopular)}>
                        Most popular
                    </button>
                </div>
                <AnimatePresence>
                    {showPopular && (
                        <motion.ul
                            className={`${styles.dropdownList} ${styles.active}`}
                            initial={{ opacity: 0, scaleY: 0, transformOrigin: "top" }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            style={{ overflow: "hidden" }}
                        >
                            {DROPDOWN_PAGES.map((item, index) => (
                                <motion.li
                                    key={item.path}
                                    className={`${styles.dropdownItem} ${pathname === item.path ? styles.active : ''}`}
                                    initial={{ opacity: 0, x: "100%", skewX: -10 }}
                                    animate={{ opacity: 1, x: 0, skewX: 0 }}
                                    exit={{ opacity: 0, x: "100%", skewX: -10 }}
                                    transition={{ delay: index * 0.05 + 0.05, duration: 0.15, ease: "easeInOut" }}
                                >
                                    <Link href={`${item.path}?timeRange=medium_term`}>{item.name}</Link>
                                </motion.li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>

            <div className={styles.linkContainer} data-tab="playlist">
                <Link href="/playlist-analyzer" className={`${styles.navLink} ${pathname === '/playlist-analyzer' ? styles.active : ''}`}>
                    Playlist Analyzer
                </Link>
            </div>

            <div className={styles.linkContainer} data-tab="contact">
                <Link href="/contact" className={`${styles.navLink} ${pathname === '/contact' ? styles.active : ''}`}>
                    Contact
                </Link>
            </div>

            {highlightStyle.width > 0 && (
                <motion.div
                    className={styles.highlight}
                    initial={isInitialRender ? { x: highlightStyle.left, width: highlightStyle.width } : false}
                    animate={{ x: highlightStyle.left, width: highlightStyle.width }}
                    transition={{ type: "spring", stiffness: 250, damping: 25 }}
                />
            )}

            <button className={styles.button} onClick={handleLogout} title="Logout" aria-label="Logout">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" x2="9" y1="12" y2="12"></line>
                </svg>
            </button>
        </motion.nav>
    );
}