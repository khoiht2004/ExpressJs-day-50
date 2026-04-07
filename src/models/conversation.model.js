const prisma = require("@/libs/prisma");

async function create(created_by, name, type, participant_ids) {
  const conversation = await prisma.conversation.create({
    data: {
      createdBy: created_by ? created_by.toString() : null,
      name,
      type,
      participants:
        participant_ids && participant_ids.length > 0
          ? {
              create: participant_ids.map((userId) => ({
                userId: parseInt(userId),
              })),
            }
          : undefined,
    },
  });

  // To bridge the new camelCase properties to the controllers which might expect the old objects (if any),
  // we could transform them, or just let controllers handle it (or assume the prompt meant everything fits).
  return conversation;
}

async function getAll(userId) {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: parseInt(userId),
        },
      },
    },
    select: {
      id: true,
      name: true,
      type: true,
      createdBy: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return conversations;
}

async function addParticipants(conversationId, participant_ids) {
  conversationId = parseInt(conversationId);

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { type: true },
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  if (conversation.type !== "group") {
    throw new Error("Conversation is not a group");
  }

  // Kiểm tra mỗi user tồn tại
  for (const userId of participant_ids) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { id: true },
    });
    if (!user) throw new Error(`User with id ${userId} not found`);

    const existing = await prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          conversationId: conversationId,
          userId: parseInt(userId),
        },
      },
    });

    if (existing) {
      throw new Error(`User with id ${userId} already in conversation`);
    }
  }

  // Thêm user vào danh sách tham gia
  const result = await prisma.conversationParticipant.createMany({
    data: participant_ids.map((userId) => ({
      conversationId: conversationId,
      userId: parseInt(userId),
    })),
  });

  return result;
}

async function sendMessages(conversationId, content, senderId) {
  conversationId = parseInt(conversationId);
  senderId = parseInt(senderId);

  // Kiểm tra user là thành viên của conversation
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      userId_conversationId: {
        conversationId: conversationId,
        userId: senderId,
      },
    },
  });

  if (!participant) {
    throw new Error("User is not a member of this conversation");
  }

  const message = await prisma.message.create({
    data: {
      conversationId: conversationId,
      senderId: senderId,
      content,
      createdAt: new Date(),
    },
    select: {
      id: true,
      conversationId: true,
      senderId: true,
      content: true,
      createdAt: true,
    },
  });

  return [message];
}

async function getMessages(conversationId, userId) {
  conversationId = parseInt(conversationId);
  userId = parseInt(userId);

  // Kiểm tra user là thành viên của conversation
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      userId_conversationId: {
        conversationId: conversationId,
        userId: userId,
      },
    },
  });

  if (!participant) {
    throw new Error("User is not a member of this conversation");
  }

  const messages = await prisma.message.findMany({
    where: {
      conversationId: conversationId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      sender: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  // map messages to format expected by controller
  return messages.map((m) => ({
    id: m.id,
    conversation_id: m.conversationId,
    sender_id: m.senderId,
    content: m.content,
    created_at: m.createdAt,
    user_id: m.sender?.id,
    email: m.sender?.email,
  }));
}

module.exports = {
  create,
  getAll,
  addParticipants,
  sendMessages,
  getMessages,
};
