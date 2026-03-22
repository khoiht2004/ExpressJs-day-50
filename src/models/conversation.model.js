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

// Hàm query kiểm tra existing DM giữa các user
async function getExistingDirectConversation(participant_ids) {
  if (participant_ids.length !== 2) return null;

  const [user1, user2] = participant_ids;

  // Tìm cuộc trò chuyện loại 'direct' mà trong đó có chứa CẢ 2 người này
  const existing = await prisma.conversations.findFirst({
    where: {
      type: "direct",
      AND: [
        { participants: { some: { user_id: parseInt(user1) } } },
        { participants: { some: { user_id: parseInt(user2) } } },
      ],
    },
  });

  return existing;
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
      participants: {
        select: {
          user: {
            select: {
              user_name: true,
              email: true,
            },
          },
        },
      },
      messages: {
        take: 1,
        orderBy: {
          created_at: "desc",
        },
        select: {
          content: true,
          created_at: true,
          // sender: {
          //   select: {
          //     id: true,
          //     user_name: true,
          //   },
          // },
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return conversations.map((c) => ({
    ...c,
    participants: c.participants.map((p) => p.user),
  }));
}

async function addParticipants(conversationId, participant_ids) {
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
    return [null, "User is not a member of this conversation"];
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

  return [message, null];
}

async function getMessages(conversationId, userId, limit = 20, before = null) {
  userId = parseInt(userId);
  const parsedLimit = parseInt(limit) || 20;

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
    return [null, "User is not a member of this conversation"];
  }

  // Lắp ghép query
  const whereCondition = {
    conversation_id: conversationId,
  };

  if (before) {
    whereCondition.id = {
      lt: parseInt(before),
    };
  }

  // Chủ ý bốc lên limit + 1 dòng để xem còn tin nhắn thừa (cũ hơn) ở backend không
  const rawMessages = await prisma.messages.findMany({
    where: whereCondition,
    orderBy: {
      created_at: "desc",
    },
    take: parsedLimit + 1,
    include: {
      sender: {
        select: {
          id: true,
          email: true,
          user_name: true,
        },
      },
    },
  });

  // Nếu số lượng lôi ra ĐÚNG BẰNG giới hạn mồi (lớn hơn limit thật sự)
  // Tức là CÒN dữ liệu nữa
  const hasMore = rawMessages.length > parsedLimit;

  // Chặt chặng mồi đi, chỉ lấy đủ limit trả cho khách
  const messagesToReturn = hasMore
    ? rawMessages.slice(0, parsedLimit)
    : rawMessages;

  // Gắp ra rồi thì phải Đảo ngược mảng để cũ nhô lên đầu (trên cùng màn hình)
  const reversedMessages = messagesToReturn.reverse();

  const formattedMessages = reversedMessages.map((m) => ({
    id: m.id,
    conversation_id: m.conversation_id,
    sender_id: m.sender_id,
    content: m.content,
    created_at: m.created_at,
    user_id: m.sender?.id,
    email: m.sender?.email,
    user_name: m.sender?.user_name,
  }));

  // Gói gọn chung thuyền đưa về
  return [
    {
      messages: formattedMessages,
      hasMore,
    },
    null,
  ];
}

async function createDirectMessages(senderId, receiverId, content) {
  senderId = parseInt(senderId);
  receiverId = parseInt(receiverId);

  // Thường thì tự nhắn cho bản thân cần 1 logic phòng khác, tạm thời chặn
  if (senderId === receiverId) {
    return [null, "Cannot send direct message to yourself"];
  }

  const participant_ids = [senderId, receiverId];

  // 1. Dùng bộ lọc check coi đã có phòng chưa
  const existing = await getExistingDirectConversation(participant_ids);
  let conversationId;

  if (existing) {
    // Có rồi thì bê luôn ID ra xài
    conversationId = existing.id;
  } else {
    // 2. Móm thì tạo phòng mới toanh
    const newConversation = await prisma.conversations.create({
      data: {
        created_by: senderId.toString(),
        type: "direct",
        created_at: new Date(),
        participants: {
          create: [{ user_id: senderId }, { user_id: receiverId }],
        },
      },
    });
    conversationId = newConversation.id;
  }

  // 3. Phệt tin nhắn vào lưu bảng messages
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

  // Trả về kết quả
  return [message, null];
}

module.exports = {
  create,
  getAll,
  addParticipants,
  sendMessages,
  getMessages,
  getExistingDirectConversation,
  createDirectMessages,
};
