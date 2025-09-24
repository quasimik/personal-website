import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

import Layout from '../components/layout';
import Date from '../components/date';
import utilStyles from '../styles/utils.module.css';
import pokerStyles from '../styles/poker.module.css';
import { v4 as uuidv4 } from 'uuid';

const projectNames = {
  'halecoin': 'HaleCoin (winner of HackUCI 2018)',
  'mcts': 'Monte Carlo tree search',
};

const resumeUrl = "https://drive.google.com/file/d/0B0k7_-vr1Q5MbVlGN252V3VaMXc/view?usp=sharing&resourcekey=0-X0IJb_u0Nbdxj77d6Vf1og";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load user name from localStorage
  useEffect(() => {
    const storedUserName = localStorage.getItem('pokerUserName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  // Fetch existing rooms
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      if (response.ok) {
        const roomsData = await response.json();
        setRooms(roomsData);
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  const createRoom = async () => {
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userId = uuidv4();
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName: userName.trim(),
          ticketDescription: 'Sample ticket - click "Next Ticket" to add your first real ticket'
        })
      });

      if (response.ok) {
        const room = await response.json();
        localStorage.setItem('pokerUserId', userId);
        localStorage.setItem('pokerUserName', userName.trim());
        router.push(`/poker/${room.id}`);
      } else {
        setError('Failed to create room');
      }
    } catch (error) {
      setError('Failed to create room');
    } finally {
      setLoading(false);
    }
  };

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
        <h2 className={utilStyles.headingLg}>Scrum Poker</h2>
        <div className={pokerStyles.scrumPokerSection}>
          <div className={pokerStyles.createRoom}>
            <h3>Create New Room</h3>
            <input
              type="text"
              placeholder="Your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className={pokerStyles.nameInput}
            />
            <button
              onClick={createRoom}
              disabled={loading}
              className={pokerStyles.createButton}
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
            {error && <p className={pokerStyles.error}>{error}</p>}
          </div>

          <div className={pokerStyles.existingRooms}>
            <h3>Existing Rooms</h3>
            {rooms.length === 0 ? (
              <p>No active rooms</p>
            ) : (
              <div className={pokerStyles.roomList}>
                {rooms.map(room => (
                  <div key={room.id} className={pokerStyles.roomItem}>
                    <div className={pokerStyles.roomInfo}>
                      <h4>Room {room.id}</h4>
                      <p>{room.participantCount} participants</p>
                      {room.currentTicket && (
                        <p className={pokerStyles.currentTicket}>{room.currentTicket}</p>
                      )}
                    </div>
                    <Link href={`/poker/${room.id}`}>
                      <button className={pokerStyles.joinButton}>Join</button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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