import { Redis } from '@upstash/redis';
import { v7 as uuidv7 } from 'uuid';

// Initialize Redis
const redis = Redis.fromEnv();

const FIBONACCI_SERIES = ['0', '1', '2', '3', '5', '8', '13', '21', '?', '☕'];

export default async function handler(req, res) {
  const { roomId } = req.query;
  const { method } = req;

  // Get room data
  const getRoom = async () => {
    return await redis.get(`room:${roomId}`);
  };

  // Update room data
  const updateRoom = async (data) => {
    return await redis.set(`room:${roomId}`, data);
  };

  switch (method) {
    case 'GET':
      try {
        const room = await getRoom();
        if (!room) {
          return res.status(404).json({ error: 'Room not found' });
        }
        res.status(200).json(room);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch room' });
      }
      break;

    case 'POST':
      try {
        const { action, userId, userName, vote, ticketDescription } = req.body;

        let room = await getRoom();

        if (!room) {
          // Create new room if it doesn't exist
          room = {
            id: roomId,
            createdAt: new Date().toISOString(),
            participants: {},
            currentTicket: null,
            revealed: false,
            tickets: [],
            moderatorId: userId
          };
        }

        switch (action) {
          case 'join':
            if (!room.participants[userId]) {
              room.participants[userId] = {
                id: userId,
                name: userName,
                joinedAt: new Date().toISOString(),
                vote: null
              };
            }
            break;

          case 'vote':
            if (room.participants[userId]) {
              room.participants[userId].vote = vote;
            }
            break;

          case 'reveal':
            room.revealed = true;
            break;

          case 'reset':
            room.revealed = false;
            // Clear all votes
            Object.keys(room.participants).forEach(participantId => {
              room.participants[participantId].vote = null;
            });
            break;

          case 'next_ticket':
            // Move to next ticket or create a new one
            if (ticketDescription) {
              room.tickets.push({
                description: ticketDescription,
                votes: {},
                revealed: false
              });
            }
            room.currentTicket = room.tickets.length - 1;
            room.revealed = false;
            // Clear all votes
            Object.keys(room.participants).forEach(participantId => {
              room.participants[participantId].vote = null;
            });
            break;

          case 'set_ticket':
            if (ticketDescription) {
              room.tickets.push({
                description: ticketDescription,
                votes: {},
                revealed: false
              });
              room.currentTicket = room.tickets.length - 1;
              room.revealed = false;
              // Clear all votes
              Object.keys(room.participants).forEach(participantId => {
                room.participants[participantId].vote = null;
              });
            }
            break;

          default:
            return res.status(400).json({ error: 'Invalid action' });
        }

        await updateRoom(room);
        res.status(200).json(room);
      } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({ error: 'Failed to update room' });
      }
      break;

    case 'DELETE':
      try {
        await redis.del(`room:${roomId}`);
        res.status(200).json({ message: 'Room deleted' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete room' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Helper function to create a new room ID
export async function createRoomId() {
  let roomId;
  let attempts = 0;
  do {
    roomId = uuidv7();
    attempts++;
    if (attempts > 10) {
      throw new Error('Failed to generate unique room ID');
    }
  } while (await redis.exists(`room:${roomId}`));

  return roomId;
}