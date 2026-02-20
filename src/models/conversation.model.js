const db = require("@/database/database");

async function create(created_by, name, type, participant_ids) {
  const [result] = await db.query(
    "INSERT INTO conversations (created_by, name, type) VALUES (?, ?, ?)",
    [created_by, name, type],
  );

  const conversationId = result.insertId;
  if (participant_ids && participant_ids.length > 0) {
    const values = participant_ids.map((userId) => [conversationId, userId]);

    await db.query(
      "INSERT INTO conversation_participants (conversation_id, user_id) VALUES ?",
      [values],
    );
  }

  const [conversations] = await db.query(
    "SELECT * FROM conversations WHERE id = ?",
    [conversationId],
  );

  return conversations[0];
}

async function getAll(userId) {
  const [conversations] = await db.query(
    `SELECT DISTINCT
  c.id,
  c.name,
  c.type,
  c.created_by,
  c.created_at
FROM
  conversations c
JOIN conversation_participants cp ON c.id = cp.conversation_id
WHERE
  cp.user_id = ?
ORDER BY
  c.created_at DESC`,
    [userId],
  );
  return conversations;
}

async function addParticipants(conversationId, participant_ids) {
  const [conversations] = await db.query(
    "SELECT type FROM conversations WHERE id = ?",
    [conversationId],
  );

  if (conversations[0].type !== "group") {
    throw new Error("Conversation is not a group");
  }

  // Kiểm tra mỗi user tồn tại
  for (const userId of participant_ids) {
    const [users] = await db.query("SELECT id FROM users WHERE id = ?", [
      userId,
    ]);
    if (!users.length) throw new Error(`User with id ${userId} not found`);
  }

  // Kiểm tra user đã tham gia chưa
  const [existing] = await db.query(
    "SELECT id FROM conversation_participants WHERE conversation_id = ? AND user_id = ?",
    [conversationId, userId],
  );

  if (existing.length)
    throw new Error(`User with id ${userId} already in conversation`);

  // Thêm user vào danh sách tham gia
  const values = participant_ids.map((userId) => [conversationId, userId]);

  return await db.query(
    "INSERT INTO conversation_participants (conversation_id, user_id) VALUES ?",
    [values],
  );
}

async function sendMessages(conversationId, content, senderId) {
  // Kiểm tra user là thành viên của conversation
  const [participants] = await db.query(
    "SELECT user_id FROM conversation_participants WHERE conversation_id = ? AND user_id = ?",
    [conversationId, senderId],
  );

  if (!participants.length) {
    throw new Error("User is not a member of this conversation");
  }

  const [result] = await db.query(
    "INSERT INTO messages (conversation_id, sender_id, content, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
    [conversationId, senderId, content],
  );

  const [messages] = await db.query(
    "SELECT id, conversation_id, sender_id, content, created_at FROM messages WHERE id = ?",
    [result.insertId],
  );

  return messages;
}

async function getMessages(conversationId) {
  // Kiểm tra user là thành viên của conversation
  const [participants] = await db.query(
    "SELECT user_id FROM conversation_participants WHERE conversation_id = ? AND user_id = ?",
    [conversationId, userId],
  );

  if (!participants.length) {
    throw new Error("User is not a member of this conversation");
  }

  const [messages] = await db.query(
    `SELECT m.id, m.conversation_id, m.sender_id, m.content, m.created_at, u.id as user_id, u.email 
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.conversation_id = ?
    ORDER BY m.created_at DESC`,
    [conversationId],
  );

  return messages;
}

module.exports = {
  create,
  getAll,
  addParticipants,
  sendMessages,
  getMessages,
};
