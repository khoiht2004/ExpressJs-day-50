const model = require("@/models/conversation.model");

async function create(req, res) {
  const { name, type, participant_ids } = req.body;
  const created_by = req.currentUser.id;

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

    const conversation = await model.create(
      created_by,
      name || null,
      type || "group",
      allParticipants,
    );

    return res.success(201, conversation);
  } catch (error) {
    console.error(error);
    return res.error(409, "Failed to create conversation");
  }
}

async function getAll(req, res) {
  const userId = req.currentUser.id;
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

  return res.success(200, "Add participants successfully");
}

async function sendMessages(req, res) {
  const conversationId = req.params.id;
  const { content } = req.body;
  const senderId = req.currentUser.id;

  await model.sendMessages(conversationId, content, senderId);

  return res.success(200, "Send message successfully");
}

async function getMessages(req, res) {
  const conversationId = req.params.id;
  const messages = await model.getMessages(conversationId);

  if (!messages) {
    return res.error(404, "Messages not found");
  }

  const response = messages.map((message) => {
    return {
      conversation_id: message.conversation_id,
      sender_id: message.sender_id,
      content: message.content,
      created_at: message.created_at,
      user: {
        id: message.user_id,
        email: message.email,
      },
    };
  });

  return res.success(200, response);
}

module.exports = {
  create,
  getAll,
  addParticipants,
  sendMessages,
  getMessages,
};
