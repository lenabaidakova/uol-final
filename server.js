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

    socket.on('send_message', async ({ requestId, senderId, text }) => {
      console.log('Message received:', { requestId, senderId, text });

      try {
        // fetch sender's name
        const sender = await prisma.user.findUnique({
          where: { id: senderId },
          select: { name: true },
        });

        if (!sender) {
          console.error('Sender not found');
          return;
        }

        // save message in db
        const savedMessage = await prisma.message.create({
          data: { requestId, senderId, text },
        });

        const requestInfo = await prisma.request.findUnique({
          where: { id: requestId },
          select: { creatorId: true, assignedToId: true },
        });

        if (!requestInfo) {
          console.error('Request not found');
          return;
        }

        // determine message recipients
        const recipients = [];
        if (requestInfo.creatorId !== senderId) {
          recipients.push(requestInfo.creatorId);
        }
        if (requestInfo.assignedToId && requestInfo.assignedToId !== senderId) {
          recipients.push(requestInfo.assignedToId);
        }

        console.log('Recipients:', recipients);

        // insert unread messages for recipients
        for (const recipientId of recipients) {
          const existingUnread = await prisma.unreadMessage.findFirst({
            where: { userId: recipientId, messageId: savedMessage.id },
          });

          if (!existingUnread) {
            await prisma.unreadMessage.create({
              data: {
                userId: recipientId,
                messageId: savedMessage.id,
                requestId,
                createdAt: new Date(),
              },
            });
          }
        }

        // emit event with saved message
        io.to(requestId).emit('receive_message', {
          ...savedMessage,
          senderName: sender.name,
        });
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
