import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

import Layout from '../../components/layout';
import utilStyles from '/styles/utils.module.css';
import pokerStyles from '/styles/poker.module.css';
import { v7 as uuidv7 } from 'uuid';

// Room name generator
const word_prefixes = [
  'Swift', 'Clever', 'Bright', 'Quick', 'Smart', 'Wise', 'Bold', 'Cool', 'Epic', 'Fast',
  'Fresh', 'Fun', 'Great', 'Hot', 'Nice', 'Rad', 'Super', 'Wild', 'Zany', 'Zippy'
];

const word_suffixes = [
  'Eagle', 'Tiger', 'Lion', 'Bear', 'Wolf', 'Fox', 'Hawk', 'Owl', 'Raven', 'Shark',
  'Whale', 'Dolphin', 'Otter', 'Seal', 'Moose', 'Deer', 'Horse', 'Zebra', 'Giraffe', 'Rhino'
];

const generateRoomName = () => {
  const word_prefix = word_prefixes[Math.floor(Math.random() * word_prefixes.length)];
  const word_suffix = word_suffixes[Math.floor(Math.random() * word_suffixes.length)];
  return `${word_prefix} ${word_suffix}`;
};

// Estimation card presets
const estimationPresets = {
  'scrum': {
    name: 'Scrum',
    cards: ['0', '½', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?', '☕']
  },
  'tshirt': {
    name: 'T-Shirt Sizes',
    cards: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '?']
  },
  'custom': {
    name: 'Custom',
    cards: []
  }
};

const pageTitle = 'Estimation Poker';

export default function EstimationPoker() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('scrum');
  const [cardList, setCardList] = useState([]);
  const [newCard, setNewCard] = useState('');
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

  // Update card list when preset changes
  useEffect(() => {
    const preset = estimationPresets[selectedPreset];
    setCardList(preset.cards.length > 0 ? [...preset.cards] : []);
  }, [selectedPreset]);

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

  // Add card to list
  const addCard = () => {
    if (newCard.trim() && !cardList.includes(newCard.trim()) && cardList.length < 20) {
      setCardList([...cardList, newCard.trim()]);
      setNewCard('');
    }
  };

  // Remove card from list
  const removeCard = (cardToRemove) => {
    setCardList(cardList.filter(card => card !== cardToRemove));
  };

  // Save room to history
  const saveRoomToHistory = (roomId, roomName, userId, userName) => {
    const newRoom = { roomId, roomName, userId, userName, timestamp: new Date().toISOString() };
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
          cardList: cardList
        })
      });

      if (response.ok) {
        const room = await response.json();
        saveRoomToHistory(room.id, room.name, userId, userName.trim());
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
    <Layout title={pageTitle}>
      <section className={utilStyles.headingMd}>
        <div className={pokerStyles.estimationPokerSection}>
          <div className={pokerStyles.createRoom}>
            <h3>Create New Room</h3>
            <div className={pokerStyles.inputGroup}>
              <label htmlFor="roomName">Room name</label>
              <input
                id="roomName"
                type="text"
                placeholder="Room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className={pokerStyles.roomNameInput}
              />
            </div>
            <div className={pokerStyles.inputGroup}>
              <label htmlFor="playerName">Your name (unique per room)</label>
              <input
                id="playerName"
                type="text"
                placeholder="Your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className={pokerStyles.nameInput}
              />
            </div>
            <div className={pokerStyles.inputGroup}>
              <label htmlFor="estimationPreset">Estimation Cards</label>
              <select
                id="estimationPreset"
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
                className={pokerStyles.presetSelect}
              >
                {Object.entries(estimationPresets).map(([key, preset]) => (
                  <option key={key} value={key}>
                    {preset.name} ({preset.cards.join(', ')})
                  </option>
                ))}
              </select>
            </div>
            <div className={pokerStyles.inputGroup}>
              <label>Card List ({cardList.length}/20 max)</label>
              <div className={pokerStyles.cardsContainer}>
                <div className={pokerStyles.cardsList}>
                  {cardList.map((card, index) => (
                    <div key={index} className={pokerStyles.cardItem}>
                      <span className={pokerStyles.cardText}>{card}</span>
                      <button
                        type="button"
                        onClick={() => removeCard(card)}
                        className={pokerStyles.removeCardButton}
                        title="Remove card"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className={pokerStyles.addCardSection}>
                  <input
                    type="text"
                    placeholder="Add card..."
                    value={newCard}
                    onChange={(e) => setNewCard(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCard()}
                    className={pokerStyles.addCardInput}
                    disabled={cardList.length >= 20}
                  />
                  <button
                    type="button"
                    onClick={addCard}
                    disabled={!newCard.trim() || cardList.includes(newCard.trim()) || cardList.length >= 20}
                    className={pokerStyles.addCardButton}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
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
                  <Link key={`${room.roomId}-${index}`} href={`/poker/${room.roomId}`} className={pokerStyles.roomItem}>
                    <div className={pokerStyles.roomInfo}>
                      <span className={pokerStyles.roomName}>{room.roomName || `Room ${room.roomId}`}</span>
                      <span className={pokerStyles.roomMeta}>
                        Joined as {room.userName} • {new Date(room.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <h3>What is this?</h3>
      <p>
        Collaborative estimation tool for agile teams.
      </p>

      <h3>How to play</h3>
      <p>
        Enter your name, create a room or join an existing one, vote on tickets privately, and reveal results when everyone has voted.
      </p>

      <h3>How did I make this?</h3>
      <p>
        Vibecoded with extreme supervision. Upstash Redis for storage. Inspired by <a href="https://firepoker.app">Firepoker</a>.
      </p>
    </Layout>
  );
}
