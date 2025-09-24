import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

import Layout from '../../components/layout';
import utilStyles from '/styles/utils.module.css';
import pokerStyles from '/styles/poker.module.css';
import { v7 as uuidv7 } from 'uuid';

// Room name generator
const adjectives = [
  'Swift', 'Clever', 'Bright', 'Quick', 'Smart', 'Wise', 'Bold', 'Cool', 'Epic', 'Fast',
  'Fresh', 'Fun', 'Great', 'Hot', 'Nice', 'Rad', 'Super', 'Wild', 'Zany', 'Zippy'
];

const nouns = [
  'Eagle', 'Tiger', 'Lion', 'Bear', 'Wolf', 'Fox', 'Hawk', 'Owl', 'Raven', 'Shark',
  'Whale', 'Dolphin', 'Otter', 'Seal', 'Moose', 'Deer', 'Horse', 'Zebra', 'Giraffe', 'Rhino'
];

const generateRoomName = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj} ${noun}`;
};

export default function ScrumPoker() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomHistory, setRoomHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load permanent user ID and prepopulate name from room history
  useEffect(() => {
    // Get or generate permanent user ID
    let storedUserId = localStorage.getItem('pokerUserId');
    if (!storedUserId) {
      storedUserId = uuidv7();
      localStorage.setItem('pokerUserId', storedUserId);
    }
    setUserId(storedUserId);

    // Generate default room name
    setRoomName(generateRoomName());

    // Prepopulate name from most recent room in history
    const storedHistory = localStorage.getItem('pokerRoomHistory');
    if (storedHistory) {
      try {
        const history = JSON.parse(storedHistory);
        if (history.length > 0 && history[0].userName) {
          setUserName(history[0].userName);
        }
      } catch (error) {
        console.error('Failed to parse room history:', error);
      }
    }
  }, []);

  // Load room history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem('pokerRoomHistory');
    if (storedHistory) {
      try {
        setRoomHistory(JSON.parse(storedHistory));
      } catch (error) {
        console.error('Failed to parse room history:', error);
      }
    }
  }, []);

  // Save room to history
  const saveRoomToHistory = (roomId, userId, userName) => {
    const newRoom = { roomId, userId, userName, timestamp: new Date().toISOString() };
    const updatedHistory = [newRoom, ...roomHistory.filter(room => room.roomId !== roomId)].slice(0, 10); // Keep only 10 most recent
    setRoomHistory(updatedHistory);
    localStorage.setItem('pokerRoomHistory', JSON.stringify(updatedHistory));
  };

  const createRoom = async () => {
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName: userName.trim(),
          roomName: roomName.trim() || generateRoomName(),
          ticketDescription: 'Sample ticket - click "Next Ticket" to add your first real ticket'
        })
      });

      if (response.ok) {
        const room = await response.json();
        saveRoomToHistory(room.id, userId, userName.trim());
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
              placeholder="Room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className={pokerStyles.roomNameInput}
            />
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

          {roomHistory.length > 0 && (
            <div className={pokerStyles.roomHistory}>
              <h3>Room History</h3>
              <div className={pokerStyles.roomList}>
                {roomHistory.map((room, index) => (
                  <div key={`${room.roomId}-${index}`} className={pokerStyles.roomItem}>
                    <div className={pokerStyles.roomInfo}>
                      <h4>{room.roomName || `Room ${room.roomId}`}</h4>
                      <p>Joined as {room.userName}</p>
                      <p className={pokerStyles.roomTimestamp}>
                        {new Date(room.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/poker/${room.roomId}`}>
                      <button className={pokerStyles.joinButton}>Rejoin</button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
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


        .room-history {
          text-align: center;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 2px solid #e9ecef;
        }

        .room-history h3 {
          color: #333;
          font-size: 22px;
          margin-bottom: 20px;
        }

        .room-timestamp {
          font-size: 12px;
          color: #888;
          font-style: italic;
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

        }
      `}</style>
    </Layout>
  );
}
