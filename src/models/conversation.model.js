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
    "SELECT * FROM conversations WHERE created_by = ?",
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

  const values = participant_ids.map((userId) => [conversationId, userId]);

  await db.query(
    "INSERT INTO conversation_participants (conversation_id, user_id) VALUES ?",
    [values],
  );
}

async function sendMessages(conversationId, content, senderId) {
  const [messages] = await db.query(
    "INSERT INTO messages (conversation_id, sender_id, content, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
    [conversationId, senderId, content],
  );

  return messages;
}

async function getMessages(conversationId) {
  const [messages] = await db.query(
    `SELECT conversation_id, sender_id, content, created_at, u.id as user_id, email 
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.conversation_id = ?
    ORDER BY created_at DESC`,
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
