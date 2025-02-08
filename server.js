// documentation https://socket.io/how-to/use-with-nextjs

const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_request', (requestId) => {
      console.log(`User joined request: ${requestId}`);
      socket.join(requestId);
    });

    socket.on('send_message', async (message) => {
      console.log('Message received:', message);

      try {
        // save message in db
        const savedMessage = await prisma.message.create({
          data: {
            requestId: message.requestId,
            senderId: message.senderId,
            text: message.text,
          },
        });

        // emit event with saved message
        io.to(message.requestId).emit('receive_message', savedMessage);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server running on http://${hostname}:${port}`);
  });
});
