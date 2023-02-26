import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import styles from '../styles/navbar.module.css';
import utilStyles from '../styles/utils.module.css';

export default function Navbar({ title }) {
  return (
    <div className={styles.navbar}>
      <h2>{title}</h2>
      <Link href="/" className={styles.backLink}>←&ensp;Back to home</Link>
    </div>
  );
}
