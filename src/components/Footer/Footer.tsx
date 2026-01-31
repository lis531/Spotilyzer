"use client";
import { motion } from "framer-motion";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <motion.footer
      className={styles.footer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className={styles.footerContent}>
        <p className={styles.copyright}>
          Borys Gajewski &copy; {new Date().getFullYear()} - All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}
