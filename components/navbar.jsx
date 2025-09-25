import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import styles from '../styles/navbar.module.css';
import utilStyles from '../styles/utils.module.css';

export default function Navbar({ title, backLink = "/", backText = "Back to home" }) {
  return (
    <div className={styles.navbar}>
      <h2>{title}</h2>
      <Link href={backLink} className={styles.backLink}>←&ensp;{backText}</Link>
    </div>
  );
}
