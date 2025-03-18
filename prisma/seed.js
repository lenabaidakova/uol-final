const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

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

  // predefined shelter names
  const shelterNames = [
    'Kind Paws Rescue',
    'Safe Haven Shelter',
    'Furry Friends Sanctuary',
    'Helping Paws Foundation',
    'Bright Hope Animal Shelter',
  ];

  // creating predefined shelter
  const fixedShelter = await prisma.user.create({
    data: {
      email: 'shelter@example.com',
      name: 'Kind Paws',
      password: hashedPassword,
      roleId: await getRoleId('SHELTER'),
      verified: true,
    },
  });

  // additional shelters
  const shelters = await Promise.all(
    shelterNames.map(async (name, index) =>
      prisma.user.create({
        data: {
          email: `shelter${index + 1}@example.com`,
          name,
          password: hashedPassword,
          roleId: await getRoleId('SHELTER'),
          verified: true,
        },
      })
    )
  );

  shelters.push(fixedShelter); // include predefined shelter in the list

  // predefined supporter
  const fixedSupporter = await prisma.user.create({
    data: {
      email: 'supporter@example.com',
      name: 'Alex Morgan',
      password: hashedPassword,
      roleId: await getRoleId('SUPPORTER'),
      verified: true,
    },
  });

  // additional supporters
  const supporters = await Promise.all(
    ['Jamie Lee', 'Taylor Brooks', 'Jordan Casey'].map(async (name, index) =>
      prisma.user.create({
        data: {
          email: `supporter${index + 2}@example.com`,
          name,
          password: hashedPassword,
          roleId: await getRoleId('SUPPORTER'),
          verified: true,
        },
      })
    )
  );

  supporters.push(fixedSupporter); // include predefined supporter in the list

  // predefined request templates
  const requestTemplates = [
    {
      title: 'Food donations needed',
      details: 'Looking for dry and wet food donations for our shelter dogs.',
      type: 'SUPPLIES',
    },
    {
      title: 'Urgent vet help required',
      details: 'We need a veterinarian to check on an injured cat.',
      type: 'SERVICES',
    },
    {
      title: 'Weekend volunteers needed',
      details:
        'Seeking volunteers to help clean and maintain shelter facilities.',
      type: 'VOLUNTEERS',
    },
    {
      title: 'Blankets and bedding needed',
      details: 'Our shelter is in need of warm blankets for winter.',
      type: 'SUPPLIES',
    },
    {
      title: 'Transport help needed',
      details:
        'Looking for someone to help transport rescued animals to foster homes.',
      type: 'SERVICES',
    },
    {
      title: 'Puppy formula needed',
      details: 'We have orphaned puppies in need of formula and bottles.',
      type: 'SUPPLIES',
    },
    {
      title: 'Cat litter donations',
      details:
        'We are running low on cat litter and would appreciate any donations.',
      type: 'SUPPLIES',
    },
    {
      title: 'Dog walking volunteers',
      details: 'Seeking volunteers to take dogs on daily walks.',
      type: 'VOLUNTEERS',
    },
    {
      title: 'Foster homes needed',
      details:
        'Looking for foster families to care for rescued animals temporarily.',
      type: 'VOLUNTEERS',
    },
    {
      title: 'Help building outdoor kennels',
      details:
        'We need volunteers to help assemble outdoor kennels for our dogs.',
      type: 'VOLUNTEERS',
    },
    {
      title: 'Pet grooming assistance',
      details:
        'Seeking a groomer to help clean and trim overgrown fur on rescued pets.',
      type: 'SERVICES',
    },
    {
      title: 'Vet training session',
      details:
        'We are looking for a veterinarian to train our staff on basic medical care.',
      type: 'SERVICES',
    },
    {
      title: 'Emergency medical supplies',
      details:
        'We urgently need bandages, antiseptics, and first-aid supplies for injured animals.',
      type: 'SUPPLIES',
    },
    {
      title: 'Photography help for adoptions',
      details:
        'Looking for a photographer to take good adoption photos of our pets.',
      type: 'SERVICES',
    },
    {
      title: 'Pet behavior training',
      details:
        'Seeking an experienced trainer to work with dogs who need behavioral adjustments.',
      type: 'SERVICES',
    },
    {
      title: 'Social media & fundraising help',
      details:
        'Looking for volunteers to help manage our social media and fundraising campaigns.',
      type: 'VOLUNTEERS',
    },
    {
      title: 'Towels and old clothes needed',
      details: 'We use old towels and clothes as bedding for our shelter pets.',
      type: 'SUPPLIES',
    },
    {
      title: 'Shelter painting and repairs',
      details:
        'Seeking volunteers to help repaint and do minor repairs at the shelter.',
      type: 'VOLUNTEERS',
    },
    {
      title: 'Large dog crates needed',
      details:
        'Looking for donations of large dog crates for transporting rescued dogs.',
      type: 'SUPPLIES',
    },
    {
      title: 'Lost pet recovery help',
      details:
        'Need volunteers to help search for and recover lost pets reported in the area.',
      type: 'VOLUNTEERS',
    },
    {
      title: 'Cleaning supplies needed',
      details:
        'We need disinfectants, mops, and other cleaning supplies to keep the shelter safe and hygienic for our animals.',
      type: 'SUPPLIES',
    },
  ];

  // creating requests
  const requestData = [];
  let fixedSupporterInProgressCount = 0; // make sure the fixedSupporter has enough data for better demo
  let fixedSupporterCompletedCount = 0;

  for (let index = 0; index < 1000; index++) {
    const template = requestTemplates[index % requestTemplates.length];
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

    let assignedToId = null;

    // ensure fixedSupporter gets more requests
    if (
      status === 'IN_PROGRESS' &&
      (index % 50 === 0 || fixedSupporterInProgressCount < 5)
    ) {
      assignedToId = fixedSupporter.id;
      fixedSupporterInProgressCount++;
    } else if (
      status === 'COMPLETED' &&
      (index % 100 === 0 || fixedSupporterCompletedCount < 5)
    ) {
      assignedToId = fixedSupporter.id;
      fixedSupporterCompletedCount++;
    } else if (status === 'IN_PROGRESS' || status === 'COMPLETED') {
      assignedToId = supporters[index % supporters.length].id;
    }

    const request = await prisma.request.create({
      data: {
        title: `${template.title} #${index + 1}`,
        typeId: await getTypeId(template.type),
        urgencyId: await getUrgencyId(urgency),
        statusId: await getStatusId(status),
        dueDate: index % 5 === 0 ? new Date('2025-04-01') : null,
        details: template.details,
        location: locations[index % locations.length],
        creatorId: shelters[index % shelters.length].id,
        assignedToId,
      },
    });

    requestData.push(request);
  }

  // messages for supporter
  const supporterMessageTemplates = [
    'I can help with this request! How can I contribute?',
    'Do you still need assistance with this?',
    'I have some supplies available. Where should I send them?',
    "I'm interested in volunteering. What are the next steps?",
    'How urgent is this? I might be able to assist soon.',
    'Can I get more details about this request?',
    'I have experience in this area—how can I best assist?',
    'Would it be helpful if I brought some extra items?',
    'I’m in the area—could I stop by to help?',
    'Let me know what is needed most, and I’ll try to help!',
  ];

  for (let i = 0; i < 500; i++) {
    const request = requestData[i % requestData.length];
    const shelter = shelters.find((s) => s.id === request.creatorId);
    const supporter = request.assignedToId
      ? supporters.find((s) => s.id === request.assignedToId) // use assigned supporter if available
      : supporters[i % supporters.length]; // or pick any supporter

    // supporter message the shelter first
    const sender = supporter;
    const recipient = shelter;

    const messageText =
      supporterMessageTemplates[i % supporterMessageTemplates.length];

    const createdMessage = await prisma.message.create({
      data: {
        requestId: request.id,
        senderId: sender.id,
        text: messageText,
      },
    });

    // insert unread message for shelter
    if (recipient && recipient.id !== sender.id) {
      await prisma.unreadMessage.create({
        data: {
          userId: recipient.id,
          messageId: createdMessage.id,
          requestId: request.id,
        },
      });
    }
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
