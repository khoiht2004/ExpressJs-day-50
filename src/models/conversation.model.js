const prisma = require("@/utils/prisma");

async function create(created_by, name, type, participant_ids) {
  const conversation = await prisma.conversations.create({
    data: {
      created_by: created_by ? created_by.toString() : null,
      name,
      type,
      participants:
        participant_ids && participant_ids.length > 0
          ? {
              create: participant_ids.map((userId) => ({
                user_id: parseInt(userId),
              })),
            }
          : undefined,
    },
  });

  return conversation;
}

async function getAll(userId) {
  const conversations = await prisma.conversations.findMany({
    where: {
      participants: {
        some: {
          user_id: parseInt(userId),
        },
      },
    },
    select: {
      id: true,
      name: true,
      type: true,
      created_by: true,
      created_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return conversations;
}

async function addParticipants(conversationId, participant_ids) {
  conversationId = parseInt(conversationId);

  const conversation = await prisma.conversations.findUnique({
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
    const user = await prisma.users.findUnique({
      where: { id: parseInt(userId) },
      select: { id: true },
    });
    if (!user) throw new Error(`User with id ${userId} not found`);

    const existing = await prisma.conversation_participants.findUnique({
      where: {
        user_id_conversation_id: {
          conversation_id: conversationId,
          user_id: parseInt(userId),
        },
      },
    });

    if (existing) {
      throw new Error(`User with id ${userId} already in conversation`);
    }
  }

  // Thêm user vào danh sách tham gia
  const result = await prisma.conversation_participants.createMany({
    data: participant_ids.map((userId) => ({
      conversation_id: conversationId,
      user_id: parseInt(userId),
    })),
  });

  return result;
}

async function sendMessages(conversationId, content, senderId) {
  conversationId = parseInt(conversationId);
  senderId = parseInt(senderId);

  // Kiểm tra user là thành viên của conversation
  const participant = await prisma.conversation_participants.findUnique({
    where: {
      user_id_conversation_id: {
        conversation_id: conversationId,
        user_id: senderId,
      },
    },
  });

  if (!participant) {
    throw new Error("User is not a member of this conversation");
  }

  const message = await prisma.messages.create({
    data: {
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      created_at: new Date(),
    },
    select: {
      id: true,
      conversation_id: true,
      sender_id: true,
      content: true,
      created_at: true,
    },
  });

  return [message];
}

async function getMessages(conversationId, userId) {
  conversationId = parseInt(conversationId);
  userId = parseInt(userId);

  // Kiểm tra user là thành viên của conversation
  const participant = await prisma.conversation_participants.findUnique({
    where: {
      user_id_conversation_id: {
        conversation_id: conversationId,
        user_id: userId,
      },
    },
  });

  if (!participant) {
    throw new Error("User is not a member of this conversation");
  }

  const messages = await prisma.messages.findMany({
    where: {
      conversation_id: conversationId,
    },
    orderBy: {
      created_at: "desc",
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

  // map messages to original format expected by controller
  return messages.map((m) => ({
    id: m.id,
    conversation_id: m.conversation_id,
    sender_id: m.sender_id,
    content: m.content,
    created_at: m.created_at,
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
