import Head from 'next/head';
import Link from 'next/link';

import Layout from '../components/layout';
import Date from '../components/date';
import utilStyles from '../styles/utils.module.css';

const projectNames = {
  'halecoin': 'HaleCoin (winner of HackUCI 2018)',
  'mcts': 'Monte Carlo tree search',
  'poker': 'Scrum poker',
};

const resumeUrl = "https://drive.google.com/file/d/0B0k7_-vr1Q5MbVlGN252V3VaMXc/view?usp=sharing&resourcekey=0-X0IJb_u0Nbdxj77d6Vf1og";

export default function Home() {

  return (
    <Layout home>
      <Head>
        <title>Personal Website</title>
      </Head>

      <section className={utilStyles.headingMd}>
        <p>I currently work as a full-stack data scientist
          with <a href="https://www.woflow.com">Woflow</a>, an early-stage startup revolutionizing
          data exchange between platforms and merchants in the retail and restaurant spaces.
        </p>
        <p>
          My long-term goal is to work on interesting problems in artificial intelligence, and I'm
          always open to new and interesting opportunities.
          Here's my <a href={resumeUrl}>resume</a>, feel free to reach out!
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