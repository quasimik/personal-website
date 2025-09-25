import { Redis } from '@upstash/redis';
import { createRoomId } from './[roomId].js';

// Initialize Redis
const redis = Redis.fromEnv();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        // Note: Upstash Database doesn't support KEYS command for performance reasons
        // In a production app, you'd maintain a separate rooms index
        // For now, return empty array - users must share room IDs directly
        const rooms = [];
        res.status(200).json(rooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Failed to fetch rooms' });
      }
      break;

    case 'POST':
      try {
        const { userId, userName, roomName, cardList } = req.body;

        if (!userId || !userName) {
          return res.status(400).json({ error: 'User ID and name are required' });
        }

        // Validate card list
        if (!cardList || !Array.isArray(cardList) || cardList.length === 0) {
          return res.status(400).json({ error: 'Card list is required and must not be empty' });
        }

        if (cardList.length > 20) {
          return res.status(400).json({ error: 'Maximum 20 cards allowed' });
        }

        const roomId = await createRoomId();

        const room = {
          id: roomId,
          name: roomName,
          cardList: cardList,
          createdAt: new Date().toISOString(),
          participants: {
            [userId]: {
              id: userId,
              name: userName,
              joinedAt: new Date().toISOString(),
              vote: null
            }
          },
          currentTicket: 0,
          revealed: false,
          tickets: [],
          moderatorId: userId
        };

        await redis.set(`room:${roomId}`, room);
        res.status(201).json(room);
      } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Failed to create room' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
