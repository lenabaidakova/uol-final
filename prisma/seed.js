const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

async function main() {
  console.log('Seeding database...');

  // seeding roles
  await prisma.role.createMany({
    data: [{ name: 'SUPPORTER' }, { name: 'SHELTER' }],
  });

  // seeding request types
  await prisma.requestType.createMany({
    data: [{ name: 'SUPPLIES' }, { name: 'SERVICES' }, { name: 'VOLUNTEERS' }],
  });

  // seeding urgency
  await prisma.requestUrgency.createMany({
    data: [{ name: 'HIGH' }, { name: 'MEDIUM' }, { name: 'LOW' }],
  });

  // seeding statuses
  await prisma.requestStatus.createMany({
    data: [
      { name: 'PENDING' },
      { name: 'IN_PROGRESS' },
      { name: 'COMPLETED' },
      { name: 'ARCHIVED' },
    ],
  });

  const getRoleId = async (name) => {
    const role = await prisma.role.findUnique({ where: { name } });
    return role.id;
  };

  const getTypeId = async (name) => {
    const type = await prisma.requestType.findUnique({ where: { name } });
    return type.id;
  };

  const getUrgencyId = async (name) => {
    const urgency = await prisma.requestUrgency.findUnique({ where: { name } });
    return urgency.id;
  };

  const getStatusId = async (name) => {
    const status = await prisma.requestStatus.findUnique({ where: { name } });
    return status.id;
  };

  const hashedPassword = await bcrypt.hash('password123', 10);

  // creating a predefined shelter
  const fixedShelter = await prisma.user.create({
    data: {
      email: 'shelter@example.com',
      name: 'Kind Paws',
      password: hashedPassword,
      roleId: await getRoleId('SHELTER'),
      verified: true,
    },
  });

  // creating a predefined supporter
  const fixedSupporter = await prisma.user.create({
    data: {
      email: 'supporter@example.com',
      name: 'Alex Morgan',
      password: hashedPassword,
      roleId: await getRoleId('SUPPORTER'),
      verified: true,
    },
  });

  // creating additional shelters
  const shelters = await Promise.all(
    Array.from({ length: 4 }, async () =>
      prisma.user.create({
        data: {
          email: faker.internet.email().toLowerCase(),
          name: faker.company.name(),
          password: hashedPassword,
          roleId: await getRoleId('SHELTER'),
          verified: true,
        },
      })
    )
  );

  shelters.push(fixedShelter); // include predefined shelter in the list

  // creating additional supporters
  const supporters = await Promise.all(
    Array.from({ length: 4 }, async () =>
      prisma.user.create({
        data: {
          email: faker.internet.email().toLowerCase(),
          name: faker.person.fullName(),
          password: hashedPassword,
          roleId: await getRoleId('SUPPORTER'),
          verified: true,
        },
      })
    )
  );

  supporters.push(fixedSupporter); // include predefined supporter in the list

  // creating requests
  const requestData = await Promise.all(
    Array.from({ length: 50 }, async (_, index) => {
      const type = ['SUPPLIES', 'SERVICES', 'VOLUNTEERS'][index % 3];
      const urgency = ['HIGH', 'MEDIUM', 'LOW'][index % 3];
      const status = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'][
        index % 4
      ];
      const locations = [
        'London',
        'Manchester',
        'Birmingham',
        'Liverpool',
        'Leeds',
      ];

      return prisma.request.create({
        data: {
          title: `${type} Request #${index + 1}`,
          typeId: await getTypeId(type),
          urgencyId: await getUrgencyId(urgency),
          statusId: await getStatusId(status),
          dueDate: index % 5 === 0 ? new Date('2025-04-01') : null,
          details: faker.lorem.sentence(),
          location: locations[index % locations.length],
          creatorId: shelters[index % shelters.length].id,
          assignedToId:
            status === 'IN_PROGRESS' || status === 'COMPLETED'
              ? supporters[index % supporters.length].id
              : null,
        },
      });
    })
  );

  // creating messages for requests
  const messages = [];
  const messageTemplates = [
    'I can help with this request! How can I contribute?',
    'Do you still need assistance with this?',
    'I have some supplies available. Where should I send them?',
    "I'm interested in volunteering. What are the next steps?",
    'How urgent is this? I might be able to assist soon.',
    'Can I get more details about this request?',
    'Thank you for offering to help! Here’s what we need…',
    'That would be amazing! When can you drop off the supplies?',
    "We're still looking for volunteers, please let us know!",
    'Much appreciated! This will help a lot!',
  ];

  for (let i = 0; i < 100; i++) {
    const request = requestData[i % requestData.length];
    const sender =
      i % 2 === 0
        ? supporters[i % supporters.length]
        : shelters[i % shelters.length];
    const messageText = messageTemplates[i % messageTemplates.length];

    const createdMessage = await prisma.message.create({
      data: {
        requestId: request.id,
        senderId: sender.id,
        text: messageText,
      },
    });

    // fetch recipients
    const recipients = [request.creatorId, request.assignedToId].filter(
      (id) => id && id !== sender.id
    );

    // insert unread messages
    await Promise.all(
      recipients.map(async (recipientId) => {
        const exists = await prisma.unreadMessage.findFirst({
          where: { userId: recipientId, messageId: createdMessage.id },
        });

        if (!exists) {
          await prisma.unreadMessage.create({
            data: {
              userId: recipientId,
              messageId: createdMessage.id,
              requestId: request.id,
            },
          });
        }
      })
    );
  }

  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
