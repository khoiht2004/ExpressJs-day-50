// prisma/seed.ts
require("dotenv").config();
require("module-alias/register");

const { PrismaClient, ConversationType } = require("./generated/prisma");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { databaseConfig } = require("@/config");
const bcrypt = require("bcrypt");

const adapter = new PrismaMariaDb({
  host: databaseConfig.host,
  user: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.database,
  port: databaseConfig.port,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ─────────────────────────────────────────
  // 1. USERS
  // ─────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("password", 10);

  const users = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      prisma.user.upsert({
        where: { email: `user${i + 1}@example.com` },
        update: {},
        create: {
          email: `user${i + 1}@example.com`,
          password: hashedPassword,
          emailVerifiedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }),
    ),
  );
  console.log(`✅ Created ${users.length} users`);

  // ─────────────────────────────────────────
  // 2. PRODUCTS (3 per user = 15 total)
  // ─────────────────────────────────────────
  const productTemplates = [
    {
      name: "Wireless Headphones",
      price: 79.99,
      stock: 50,
      description: "Bluetooth over-ear headphones with noise cancelling.",
    },
    {
      name: "Mechanical Keyboard",
      price: 119.0,
      stock: 30,
      description: "TKL mechanical keyboard with RGB backlight.",
    },
    {
      name: "USB-C Hub 7-in-1",
      price: 39.99,
      stock: 100,
      description: "Supports HDMI 4K, USB 3.0, SD card, and PD charging.",
    },
    {
      name: "Webcam 1080p",
      price: 59.0,
      stock: 40,
      description: "Full HD webcam with built-in microphone.",
    },
    {
      name: "Laptop Stand Aluminum",
      price: 29.99,
      stock: 80,
      description: 'Adjustable aluminum stand for 11–17" laptops.',
    },
    {
      name: "LED Desk Lamp",
      price: 24.99,
      stock: 60,
      description: "Touch-controlled desk lamp with 3 color modes.",
    },
    {
      name: "Mouse Pad XL",
      price: 14.99,
      stock: 200,
      description: "Extended gaming mouse pad 90×40cm, non-slip base.",
    },
    {
      name: "Smart Plug WiFi",
      price: 19.99,
      stock: 90,
      description: "Works with Alexa and Google Home, schedule via app.",
    },
    {
      name: "Portable SSD 512GB",
      price: 89.0,
      stock: 25,
      description: "USB 3.2 Gen 2, read up to 1050 MB/s.",
    },
    {
      name: "Cable Management Kit",
      price: 12.5,
      stock: 150,
      description: "Velcro straps, clips, and sleeves for tidy desks.",
    },
    {
      name: "Screen Cleaner Kit",
      price: 9.99,
      stock: 300,
      description: "Microfiber cloth + spray for monitors and phones.",
    },
    {
      name: "RGB LED Strip 5m",
      price: 22.0,
      stock: 70,
      description: "App-controlled RGB strip with music sync mode.",
    },
    {
      name: "Ergonomic Wrist Rest",
      price: 17.99,
      stock: 110,
      description: "Memory foam wrist rest for keyboard and mouse.",
    },
    {
      name: "HDMI 2.1 Cable 2m",
      price: 11.0,
      stock: 180,
      description: "Supports 8K@60Hz and 4K@120Hz, braided nylon.",
    },
    {
      name: "Mini Air Purifier",
      price: 49.99,
      stock: 35,
      description: "HEPA H13 filter, covers up to 20m², USB-C powered.",
    },
  ];

  const products = await Promise.all(
    productTemplates.map((template, i) =>
      prisma.product.create({
        data: {
          ...template,
          userId: users[i % 5].id, // phân đều cho 5 user
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }),
    ),
  );
  console.log(`✅ Created ${products.length} products`);

  // ─────────────────────────────────────────
  // 3. CONVERSATIONS
  //    - 2 direct (1-1): u1↔u2, u3↔u4
  //    - 1 group: u1, u2, u3, u4, u5
  // ─────────────────────────────────────────
  const [conv1, conv2, conv3] = await Promise.all([
    prisma.conversation.create({
      data: {
        type: ConversationType.direct,
        createdBy: users[0].email,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.conversation.create({
      data: {
        type: ConversationType.direct,
        createdBy: users[2].email,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.conversation.create({
      data: {
        type: ConversationType.group,
        name: "Team Alpha",
        createdBy: users[0].email,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);
  console.log("✅ Created 3 conversations");

  // ─────────────────────────────────────────
  // 4. CONVERSATION PARTICIPANTS
  // ─────────────────────────────────────────
  await prisma.conversationParticipant.createMany({
    data: [
      // direct: user1 ↔ user2
      { conversationId: conv1.id, userId: users[0].id },
      { conversationId: conv1.id, userId: users[1].id },
      // direct: user3 ↔ user4
      { conversationId: conv2.id, userId: users[2].id },
      { conversationId: conv2.id, userId: users[3].id },
      // group: tất cả 5 user
      ...users.map((u) => ({ conversationId: conv3.id, userId: u.id })),
    ],
  });
  console.log("✅ Created participants");

  // ─────────────────────────────────────────
  // 5. MESSAGES
  // ─────────────────────────────────────────
  const now = Date.now();
  const min = 60_000;

  await prisma.message.createMany({
    data: [
      // conv1: user1 ↔ user2
      {
        conversationId: conv1.id,
        senderId: users[0].id,
        content: "Hey user2, have you checked the new products?",
        createdAt: new Date(now - 30 * min),
        updatedAt: new Date(now - 30 * min),
      },
      {
        conversationId: conv1.id,
        senderId: users[1].id,
        content: "Yes! The Portable SSD looks great. Thinking of buying one.",
        createdAt: new Date(now - 28 * min),
        updatedAt: new Date(now - 28 * min),
      },
      {
        conversationId: conv1.id,
        senderId: users[0].id,
        content: "Let me know what you think after purchase!",
        createdAt: new Date(now - 25 * min),
        updatedAt: new Date(now - 25 * min),
      },

      // conv2: user3 ↔ user4
      {
        conversationId: conv2.id,
        senderId: users[2].id,
        content: "Hi! Can you ship to District 7?",
        createdAt: new Date(now - 20 * min),
        updatedAt: new Date(now - 20 * min),
      },
      {
        conversationId: conv2.id,
        senderId: users[3].id,
        content: "Sure, we cover all districts in HCMC.",
        createdAt: new Date(now - 18 * min),
        updatedAt: new Date(now - 18 * min),
      },
      {
        conversationId: conv2.id,
        senderId: users[2].id,
        content: "Perfect, placing the order now.",
        createdAt: new Date(now - 15 * min),
        updatedAt: new Date(now - 15 * min),
      },

      // conv3: group "Team Alpha"
      {
        conversationId: conv3.id,
        senderId: users[0].id,
        content: "Welcome everyone to Team Alpha 👋",
        createdAt: new Date(now - 60 * min),
        updatedAt: new Date(now - 60 * min),
      },
      {
        conversationId: conv3.id,
        senderId: users[1].id,
        content: "Thanks! Excited to work together.",
        createdAt: new Date(now - 58 * min),
        updatedAt: new Date(now - 58 * min),
      },
      {
        conversationId: conv3.id,
        senderId: users[2].id,
        content: "Same here. What is our first task?",
        createdAt: new Date(now - 55 * min),
        updatedAt: new Date(now - 55 * min),
      },
      {
        conversationId: conv3.id,
        senderId: users[3].id,
        content: "Let me check the backlog and update everyone shortly.",
        createdAt: new Date(now - 52 * min),
        updatedAt: new Date(now - 52 * min),
      },
      {
        conversationId: conv3.id,
        senderId: users[4].id,
        content: "Roger that. Standing by 🙌",
        createdAt: new Date(now - 50 * min),
        updatedAt: new Date(now - 50 * min),
      },
    ],
  });
  console.log("✅ Created messages");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
