const model = require("@/models/conversation.model");
const pusher = require("@/libs/pusher");

async function create(req, res) {
  const { name, type, participant_ids } = req.body;
  const created_by = req.auth.user.id;

  // Validate
  if (!type || !["group", "direct"].includes(type)) {
    return res.error(400, "Type must be 'group' or 'direct'");
  }

  if (!participant_ids || !Array.isArray(participant_ids)) {
    return res.error(400, "participant_ids must be an array");
  }

  // Validate logic từng loại conversation
  if (type === "direct" && participant_ids.length !== 1) {
    return res.error(
      400,
      "Direct conversation must have exactly 1 participant",
    );
  }

  if (type === "group" && participant_ids.length < 1) {
    return res.error(
      400,
      "Group conversation must have at least 1 participant",
    );
  }

  try {
    // Thêm người tạo vào danh sách participants
    // Dùng Set để loại bỏ các participant trùng lặp
    const allParticipants = [...new Set([...participant_ids, created_by])];

    if (type === "direct") {
      const existingDm =
        await model.getExistingDirectConversation(allParticipants);
      if (existingDm) {
        return res.success(200, existingDm);
      }
    }

    const conversation = await model.create(
      created_by,
      name || null,
      type || "group",
      allParticipants,
    );

    return res.success(201, conversation);
  } catch (error) {
    console.error(error);
    return res.error(500, "Internal Server Error");
  }
}

async function getAll(req, res) {
  const userId = req.auth.user.id;
  const conversations = await model.getAll(userId);

  if (!conversations) {
    return res.error(404, "Conversations not found");
  }

  return res.success(200, conversations);
}

async function addParticipants(req, res) {
  const conversationId = req.params.id;
  const { participant_ids } = req.body;

  if (!participant_ids || !Array.isArray(participant_ids)) {
    return res.error(400, "participant_ids must be an array");
  }

  await model.addParticipants(conversationId, participant_ids);

  return res.success(201, {
    user_ids: participant_ids,
    joined_at: new Date(),
  });
}

async function sendMessages(req, res) {
  const conversationId = req.params.id;
  const { content } = req.body;
  const senderId = req.auth.user.id;

  // Kiểm tra content không rỗng
  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.error(400, "Message content cannot be empty");
  }

  const [data, error] = await model.sendMessages(
    conversationId,
    content,
    senderId,
  );

  if (error && !data) {
    return res.error(403, error);
  }

  // Bắn event
  pusher.trigger(`conversation-${conversationId}`, "sended", data);

  return res.success(201, data);
}

async function getMessages(req, res) {
  const conversationId = req.params.id;
  const userId = req.auth.user.id;
  const { limit, before } = req.query;

  const [data, error] = await model.getMessages(
    conversationId,
    userId,
    limit,
    before,
  );

  if (error && !data) {
    return res.error(404, error);
  }

  const responseMessages = data.messages.map((message) => {
    return {
      id: message.id, // Bắn kèm id để FE lấy làm before cho trang tiếp theo
      conversation_id: message.conversation_id,
      sender_id: message.sender_id,
      user: {
        id: message.user_id,
        user_name: message.user_name,
        email: message.email,
      },
      content: message.content,
      created_at: message.created_at,
    };
  });

  return res.success(200, {
    messages: responseMessages,
    hasMore: data.hasMore,
  });
}

async function createDirectMessages(req, res) {
  const { receiver_id, content } = req.body;
  const senderId = req.auth.user.id;

  if (!receiver_id) {
    return res.error(400, "receiver_id is required");
  }

  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.error(400, "Message content cannot be empty");
  }

  try {
    const [data, error] = await model.createDirectMessages(
      senderId,
      receiver_id,
      content
    );

    if (error && !data) {
      return res.error(400, error);
    }

    return res.success(201, data);
  } catch (error) {
    console.error(error);
    return res.error(500, "Internal Server Error");
  }
}

module.exports = {
  create,
  getAll,
  addParticipants,
  sendMessages,
  getMessages,
  createDirectMessages,
};
