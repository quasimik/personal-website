import Head from 'next/head';
import Link from 'next/link';

import Layout from '../components/layout';
import Date from '../components/date';
import utilStyles from '../styles/utils.module.css';

const projectNames = {
  'family': 'Family tree organizer',
  'mcts': 'Monte Carlo tree search',
  'halecoin': 'HaleCoin (winner of HackUCI 2018)',
};

export default function Home() {
  return (
    <Layout home>
      <section className={utilStyles.headingMd}>
        <p>I currently work as a full-stack data scientist with <a href="https://www.woflow.com">Woflow</a>, an
          early-stage startup revolutionizing data exchange between restaurants and food delivery platforms.
        </p>
        <p>
          My long-term goal is to work on interesting problems in
          artificial intelligence, and right now, I see neurosymbolic AI to be a promising path in that direction.
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>My projects:</h2>
        <ul className={utilStyles.list}>
          {Object.entries(projectNames).map(( [key, title] ) => (
            <li className={utilStyles.listItem} key={key}>
              <Link href={`/projects/${key}`}>{title}</Link>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
