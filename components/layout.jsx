import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from '../styles/layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Navbar from './navbar'

const name = 'Michael Liu';
export const siteTitle = 'Michael\'s Personal Website';

export default function Layout({ children, home, title }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{siteTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content={siteTitle}
        />
        <meta name="og:title" content={siteTitle} />
        <base target="_blank" />
      </Head>
      <header>
        {home ? (
          <div className={styles.profile}>
            <Image
              priority
              src="/images/profile.jpg"
              className={utilStyles.borderCircle}
              height={256}
              width={256}
              alt=""
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </div>
        ) : (
          <Navbar title={title} />
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}
