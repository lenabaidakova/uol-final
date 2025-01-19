const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with shelter users and requests...');

  const shelter1 = await prisma.user.create({
    data: {
      email: 'shelter1@example.com',
      name: 'Shelter A',
      password: 'password123',
      role: 'SHELTER',
    },
  });

  const shelter2 = await prisma.user.create({
    data: {
      email: 'shelter2@example.com',
      name: 'Shelter B',
      password: 'password123',
      role: 'SHELTER',
    },
  });

  const sampleRequests = [
    {
      title: 'Need blankets for winter',
      type: 'SUPPLIES',
      urgency: 'HIGH',
      dueDate: new Date('2025-02-01'),
      details: 'We need 100 blankets to help homeless animals during winter',
      location: 'London',
      status: 'PENDING',
      creatorId: shelter1.id,
    },
    {
      title: 'Looking for volunteers for cleanup',
      type: 'VOLUNTEERS',
      urgency: 'MEDIUM',
      dueDate: new Date('2025-03-01'),
      details: 'We need 10 volunteers for a shelter cleanup drive',
      location: 'Manchester',
      status: 'IN_PROGRESS',
      creatorId: shelter2.id,
    },
    {
      title: 'Need medical supplies',
      type: 'SUPPLIES',
      urgency: 'LOW',
      details: 'Any donations of medical supplies would be appreciated',
      location: 'London',
      status: 'PENDING',
      creatorId: shelter1.id,
    },
    {
      title: 'Dog training services required',
      type: 'SERVICES',
      urgency: 'HIGH',
      details: 'We need professional training services for 5 rescue dogs',
      location: 'Manchester',
      status: 'PENDING',
      creatorId: shelter2.id,
    },
    {
      title: 'Seeking transport volunteers',
      type: 'VOLUNTEERS',
      urgency: 'MEDIUM',
      details:
        'Volunteers needed to help transport animals to adoption centers.',
      location: 'London',
      status: 'ARCHIVED',
      creatorId: shelter1.id,
    },
    ...Array.from({ length: 15 }, (_, index) => ({
      title: `General request #${index + 6}`,
      type: index % 2 === 0 ? 'SUPPLIES' : 'SERVICES',
      urgency: index % 3 === 0 ? 'HIGH' : index % 3 === 1 ? 'MEDIUM' : 'LOW',
      dueDate: index % 5 === 0 ? new Date('2025-04-01') : null,
      details: `Details for request #${index + 6}.`,
      location: index % 2 === 0 ? 'London' : 'Manchester',
      status: index % 4 === 0 ? 'PENDING' : 'IN_PROGRESS',
      creatorId: index % 2 === 0 ? shelter1.id : shelter2.id,
    })),
  ];

  for (const request of sampleRequests) {
    await prisma.request.create({ data: request });
  }

  console.log('Seeding completed with shelter users and requests.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
