import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/layout';
import { v7 as uuidv7 } from 'uuid';
import styles from '../../styles/poker.module.css';
import {
  JoinForm,
  ParticipantsList,
  TicketList
} from '../../components/poker';


export default function PokerRoom() {
  const router = useRouter();
  const { roomId } = router.query;

  const [room, setRoom] = useState(null);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [selectedVote, setSelectedVote] = useState(null);
  const [cardList, setCardList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');

  // Load permanent user ID and prepopulate name from room history
  useEffect(() => {
    // Get permanent user ID
    let storedUserId = localStorage.getItem('pokerUserId');
    if (!storedUserId) {
      storedUserId = uuidv7();
      localStorage.setItem('pokerUserId', storedUserId);
    }
    setUserId(storedUserId);

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

  // Fetch room data
  const fetchRoom = useCallback(async () => {
    if (!roomId) return;

    try {
      const response = await fetch(`/api/rooms/${roomId}`);
      if (response.ok) {
        const roomData = await response.json();
        setRoom(roomData);
        setIsJoined(!!roomData.participants?.[userId]);
        // Set card list from room data
        if (roomData.cardList && Array.isArray(roomData.cardList)) {
          setCardList(roomData.cardList);
        }
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
        // Save to room history
        const roomHistory = JSON.parse(localStorage.getItem('pokerRoomHistory') || '[]');
        const newRoom = {
          roomId,
          roomName: room?.name || `Room ${roomId}`,
          userId,
          userName: userName.trim(),
          timestamp: new Date().toISOString()
        };
        const updatedHistory = [newRoom, ...roomHistory.filter(room => room.roomId !== roomId)].slice(0, 10);
        localStorage.setItem('pokerRoomHistory', JSON.stringify(updatedHistory));
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
  const isModerator = room?.moderatorId === userId;
  // Check if current user has voted on current ticket
  const hasVoted = currentTicket?.votes && currentTicket.votes[userId];
  // Check if all participants have voted
  const allParticipantsVoted = room && currentTicket?.votes &&
    Object.keys(currentTicket.votes).length === Object.keys(room.participants).length;
  const votesRevealed = room?.revealed;

  return (
    <Layout title={`Scrum Poker - ${room?.name || `Room ${roomId}`}`}>
      <div className={styles.pokerRoom}>
        {!isJoined ? (
          <JoinForm
            userName={userName}
            setUserName={setUserName}
            handleJoin={handleJoin}
            loading={loading}
            error={error}
          />
        ) : (
          <div className={styles.roomContent}>
            <TicketList
              tickets={room.tickets}
              currentTicket={room.currentTicket}
              cardList={cardList}
              votesRevealed={votesRevealed}
              allParticipantsVoted={allParticipantsVoted}
              loading={loading}
              selectedVote={selectedVote}
              handleVote={handleVote}
              isModerator={isModerator}
              newTicketDescription={newTicketDescription}
              setNewTicketDescription={setNewTicketDescription}
              handleNextTicket={handleNextTicket}
              handleReveal={handleReveal}
              handleReset={handleReset}
              participants={room.participants}
              userId={userId}
            />

            <ParticipantsList
              participants={room.participants}
              userId={userId}
              currentTicket={currentTicket}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
