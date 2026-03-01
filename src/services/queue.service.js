const db = require("@/database/database");

class QueueService {
  async push(type, payload) {
    const jsonPayload = JSON.stringify(payload);
    await db.query("INSERT INTO queues (type, payload) VALUES (?, ?)", [
      type,
      jsonPayload,
    ]);
  }

  async getPendingJobs() {
    const [rows] = await db.query(
      "SELECT * FROM queues WHERE status = 'pending' ORDER BY id ASC LIMIT 1",
    );
    const firstJob = rows[0];
    return firstJob ?? null;
  }

  async updateStatus(id, status) {
    await db.query(
      "UPDATE queues SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, id],
    );
  }
}

module.exports = new QueueService();
