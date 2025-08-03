"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";

export default function Navigation() {
    const [showPopular, setShowPopular] = useState(false);
    const pathname = usePathname();

    // Check if current page is one of the dropdown pages
    const isDropdownPage = ['/tracks', '/genres', '/artists'].includes(pathname);
    const shouldHighlightDropdown = showPopular || isDropdownPage;

    const handleClickOutside = (event: MouseEvent) => {
        if (!(event.target instanceof Element) || !event.target.closest(`.${styles.dropdownContainer}`)) {
            setShowPopular(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <nav className={styles.nav}>
            <motion.div className={styles.linkContainer}>
                <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`} >
                    Home
                </Link>
                {pathname === '/' && (
                    <motion.div className={styles.highlight} layoutId="highlight" transition={{ duration: 0.2, ease: "easeInOut" }} />
                )}
            </motion.div>

            <div className={styles.dropdownContainer}>
                <motion.div className={styles.linkContainer}>
                    <button className={`${styles.button} ${shouldHighlightDropdown ? styles.active : ''}`} onClick={() => setShowPopular(!showPopular)} >
                        Most popular
                    </button>
                    {shouldHighlightDropdown && (
                        <motion.div className={styles.highlight} layoutId="highlight" transition={{ duration: 0.2, ease: "easeInOut" }} />
                    )}
                </motion.div>
                <AnimatePresence>
                    {showPopular && (
                        <motion.ul
                            className={styles.dropdownList}
                            initial={{ opacity: 0, scaleY: 0, transformOrigin: "top" }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            style={{ overflow: "hidden" }}
                        >
                            <motion.li
                                initial={{ opacity: 0, x: "100%", skewX: -10 }}
                                animate={{ opacity: 1, x: 0, skewX: 0 }}
                                exit={{ opacity: 0, x: "100%", skewX: -10 }}
                                transition={{ delay: 0.05, duration: 0.15, ease: "easeInOut" }}
                            >
                                <Link href="/tracks">Tracks</Link>
                            </motion.li>
                            <motion.li
                                initial={{ opacity: 0, x: "100%", skewX: -10 }}
                                animate={{ opacity: 1, x: 0, skewX: 0 }}
                                exit={{ opacity: 0, x: "100%", skewX: -10 }}
                                transition={{ delay: 0.1, duration: 0.15, ease: "easeInOut" }}
                            >
                                <Link href="/genres">Genres</Link>
                            </motion.li>
                            <motion.li
                                initial={{ opacity: 0, x: "100%", skewX: -10 }}
                                animate={{ opacity: 1, x: 0, skewX: 0 }}
                                exit={{ opacity: 0, x: "100%", skewX: -10 }}
                                transition={{ delay: 0.15, duration: 0.15, ease: "easeInOut" }}
                            >
                                <Link href="/artists">Artists</Link>
                            </motion.li>
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>

            <motion.div className={styles.linkContainer}>
                <Link href="/contact" className={`${styles.navLink} ${pathname === '/contact' ? styles.active : ''}`} >
                    Contact
                </Link>
                {pathname === '/contact' && (
                    <motion.div className={styles.highlight} layoutId="highlight" transition={{ duration: 0.2, ease: "easeInOut" }}/>
                )}
            </motion.div>
        </nav>
    );
}
