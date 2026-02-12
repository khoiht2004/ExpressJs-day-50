const db = require("@/database/database");

async function create(created_by, name, type, participant_ids) {
  const [conversations] = await db.execute(
    "INSERT INTO conversations (created_by, name, type) VALUES (?, ?, ?)",
    [created_by, name, type],
  );
  console.log(conversations);

  return conversations[0];
}

module.exports = {
  create,
};
