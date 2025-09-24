import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/layout';
import { v4 as uuidv4 } from 'uuid';
import styles from '../../styles/poker.module.css';

const FIBONACCI_SERIES = ['0', '1', '2', '3', '5', '8', '13', '21', '?', '☕'];

export default function PokerRoom() {
  const router = useRouter();
  const { roomId } = router.query;

  const [room, setRoom] = useState(null);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [selectedVote, setSelectedVote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');

  // Generate or retrieve user ID
  useEffect(() => {
    const storedUserId = localStorage.getItem('pokerUserId');
    const storedUserName = localStorage.getItem('pokerUserName');

    if (storedUserId && storedUserName) {
      setUserId(storedUserId);
      setUserName(storedUserName);
    } else {
      const newUserId = uuidv4();
      setUserId(newUserId);
      localStorage.setItem('pokerUserId', newUserId);
    }
  }, []);

  // Fetch room data
  const fetchRoom = useCallback(async () => {
    if (!roomId) return;

    try {
      const response = await fetch(`/api/rooms/${roomId}`);
      if (response.ok) {
        const roomData = await response.json();
        setRoom(roomData);
        setIsJoined(!!roomData.participants?.[userId]);
      } else {
        setError('Room not found');
      }
    } catch (error) {
      setError('Failed to fetch room data');
    }
  }, [roomId, userId]);

  // Initial fetch and polling
  useEffect(() => {
    if (roomId) {
      fetchRoom();
      const interval = setInterval(fetchRoom, 2000); // Poll every 2 seconds
      return () => clearInterval(interval);
    }
  }, [roomId, fetchRoom]);

  // Join room
  const handleJoin = async () => {
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          userId,
          userName: userName.trim()
        })
      });

      if (response.ok) {
        setIsJoined(true);
        localStorage.setItem('pokerUserName', userName.trim());
        fetchRoom();
      } else {
        setError('Failed to join room');
      }
    } catch (error) {
      setError('Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  // Submit vote
  const handleVote = async (vote) => {
    if (!isJoined) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'vote',
          userId,
          vote
        })
      });

      if (response.ok) {
        setSelectedVote(vote);
        fetchRoom();
      }
    } catch (error) {
      setError('Failed to submit vote');
    } finally {
      setLoading(false);
    }
  };

  // Reveal votes
  const handleReveal = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reveal',
          userId
        })
      });

      if (response.ok) {
        fetchRoom();
      }
    } catch (error) {
      setError('Failed to reveal votes');
    } finally {
      setLoading(false);
    }
  };

  // Reset votes
  const handleReset = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset',
          userId
        })
      });

      if (response.ok) {
        setSelectedVote(null);
        fetchRoom();
      }
    } catch (error) {
      setError('Failed to reset votes');
    } finally {
      setLoading(false);
    }
  };

  // Set next ticket
  const handleNextTicket = async () => {
    if (!newTicketDescription.trim()) {
      setError('Please enter a ticket description');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'next_ticket',
          userId,
          ticketDescription: newTicketDescription.trim()
        })
      });

      if (response.ok) {
        setNewTicketDescription('');
        setSelectedVote(null);
        fetchRoom();
      }
    } catch (error) {
      setError('Failed to set next ticket');
    } finally {
      setLoading(false);
    }
  };

  if (!roomId) {
    return <Layout><div>Loading...</div></Layout>;
  }

  if (error && !room) {
    return (
      <Layout>
        <div className={styles.error}>
          <h1>Error</h1>
          <p>{error}</p>
          <button onClick={() => router.push('/')}>Go Home</button>
        </div>
      </Layout>
    );
  }

  const currentTicket = room?.tickets?.[room?.currentTicket];
  const isOrganizer = room?.organizerId === userId;
  const hasVoted = selectedVote || room?.participants?.[userId]?.vote;
  const allParticipantsVoted = room && Object.values(room.participants).every(p => p.vote !== null);
  const votesRevealed = room?.revealed;

  return (
    <Layout>
      <Head>
        <title>Scrum Poker - Room {roomId}</title>
      </Head>

      <div className={styles.pokerRoom}>
        <h1>Scrum Poker - Room {roomId}</h1>

        {!isJoined ? (
          <div className={styles.joinForm}>
            <h2>Join Room</h2>
            <input
              type="text"
              placeholder="Your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <button onClick={handleJoin} disabled={loading}>
              {loading ? 'Joining...' : 'Join Room'}
            </button>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        ) : (
          <div className={styles.roomContent}>
            <div className={styles.participants}>
              <h3>Participants ({Object.keys(room.participants).length})</h3>
              <div className={styles.participantList}>
                {Object.values(room.participants).map(participant => (
                  <div key={participant.id} className={styles.participant}>
                    <span className={styles.participantName}>{participant.name}</span>
                    {votesRevealed ? (
                      <span className={styles.participantVote}>{participant.vote || 'No vote'}</span>
                    ) : (
                      <span className={styles.participantStatus}>
                        {participant.vote ? '✅' : '⏳'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {currentTicket ? (
              <div className={styles.ticketSection}>
                <h2>Current Ticket</h2>
                <p className={styles.ticketDescription}>{currentTicket.description}</p>

                {!votesRevealed ? (
                  <div className={styles.votingSection}>
                    <h3>Cast Your Vote</h3>
                    <div className={styles.votingCards}>
                      {FIBONACCI_SERIES.map(vote => (
                        <button
                          key={vote}
                          className={`${styles.voteCard} ${selectedVote === vote ? styles.selected : ''}`}
                          onClick={() => handleVote(vote)}
                          disabled={loading}
                        >
                          {vote}
                        </button>
                      ))}
                    </div>
                    {hasVoted && (
                      <p className={styles.voteStatus}>You voted: {selectedVote}</p>
                    )}
                  </div>
                ) : (
                  <div className={styles.resultsSection}>
                    <h3>Results</h3>
                    <div className={styles.votesSummary}>
                      {Object.entries(currentTicket.votes || {})
                        .sort(([a], [b]) => {
                          const aIndex = FIBONACCI_SERIES.indexOf(a);
                          const bIndex = FIBONACCI_SERIES.indexOf(b);
                          return aIndex - bIndex;
                        })
                        .map(([vote, count]) => (
                          <div key={vote} className={styles.voteResult}>
                            <span className={styles.voteValue}>{vote}</span>
                            <span className={styles.voteCount}>{count} vote{count !== 1 ? 's' : ''}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {isOrganizer && (
                  <div className={styles.organizerControls}>
                    {!votesRevealed ? (
                      <button
                        onClick={handleReveal}
                        disabled={!allParticipantsVoted || loading}
                        className={styles.revealButton}
                      >
                        Reveal Votes
                      </button>
                    ) : (
                      <>
                        <button onClick={handleReset} disabled={loading} className={styles.resetButton}>
                          Reset Votes
                        </button>
                        <div className={styles.nextTicket}>
                          <input
                            type="text"
                            placeholder="Next ticket description"
                            value={newTicketDescription}
                            onChange={(e) => setNewTicketDescription(e.target.value)}
                          />
                          <button onClick={handleNextTicket} disabled={loading}>
                            Next Ticket
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.noTicket}>
                <h2>No Active Ticket</h2>
                {isOrganizer && (
                  <div className={styles.createTicket}>
                    <input
                      type="text"
                      placeholder="Ticket description"
                      value={newTicketDescription}
                      onChange={(e) => setNewTicketDescription(e.target.value)}
                    />
                    <button onClick={handleNextTicket} disabled={loading}>
                      Create First Ticket
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
