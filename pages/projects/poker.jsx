import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

import Layout from '../../components/layout';
import utilStyles from '/styles/utils.module.css';
import pokerStyles from '/styles/poker.module.css';
import { v7 as uuidv7 } from 'uuid';

export default function ScrumPoker() {
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
      const userId = uuidv7();
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
        console.error('Failed to create room:', response);
        setError('Failed to create room');
      }
    } catch (error) {
      console.error('Failed to create room:', error);
      setError('Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Scrum Poker - Personal Website</title>
        <meta name="description" content="Real-time collaborative estimation tool for agile teams" />
      </Head>

      <div className={utilStyles.headingMd}>
        <h1>Scrum Poker</h1>
        <p>
          A real-time collaborative estimation tool for agile teams. Create rooms, invite your team,
          and estimate user stories using the Fibonacci sequence in a fun, interactive way.
        </p>
        <p>
          <strong>How it works:</strong> Enter your name, create a room or join an existing one,
          vote on tickets privately, and reveal results when everyone has voted.
        </p>
      </div>

      <section className={utilStyles.headingMd}>
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

      <section className={utilStyles.headingMd}>
        <p>
          <Link href="/">← Back to Home</Link>
        </p>
      </section>

      <style jsx>{`
        .scrum-poker-section {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          padding: 30px;
          border-radius: 12px;
          margin: 20px 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .create-room {
          text-align: center;
          margin-bottom: 40px;
          padding: 30px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .create-room h3 {
          margin-top: 0;
          color: #333;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .name-input {
          padding: 14px;
          font-size: 16px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          margin-right: 12px;
          width: 220px;
          transition: border-color 0.2s;
        }

        .name-input:focus {
          outline: none;
          border-color: #1976d2;
        }

        .create-button {
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 600;
          background: linear-gradient(135deg, #1976d2, #2196f3);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .create-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #1565c0, #1976d2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
        }

        .create-button:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .existing-rooms {
          text-align: center;
        }

        .existing-rooms h3 {
          color: #333;
          font-size: 22px;
          margin-bottom: 20px;
        }

        .room-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .room-item {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .room-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        }

        .room-info h4 {
          margin: 0 0 8px 0;
          color: #1976d2;
          font-size: 18px;
        }

        .room-info p {
          margin: 4px 0;
          font-size: 14px;
          color: #666;
        }

        .current-ticket {
          font-style: italic;
          color: #888;
          font-size: 13px;
        }

        .join-button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #2e7d32, #4caf50);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .join-button:hover {
          background: linear-gradient(135deg, #1b5e20, #2e7d32);
          transform: translateY(-1px);
        }

        .error {
          color: #d32f2f;
          margin-top: 12px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .name-input {
            width: 180px;
            margin-right: 0;
            margin-bottom: 12px;
          }

          .create-button {
            width: 100%;
          }

          .room-list {
            grid-template-columns: 1fr;
          }

          .room-item {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
          }

          .join-button {
            width: 100%;
          }
        }
      `}</style>
    </Layout>
  );
}
