const prisma = require("@/utils/prisma");

class QueueService {
  async push(type, payload, isPriority = 0) {
    const jsonPayload = JSON.stringify(payload);
    await prisma.queues.create({
      data: {
        type,
        payload: jsonPayload,
        is_priority: isPriority,
      },
    });
  }

  async getPendingJobs() {
    const firstJob = await prisma.queues.findFirst({
      where: {
        status: "pending",
      },
      orderBy: [
        { is_priority: "desc" },
        { id: "asc" },
      ],
    });
    return firstJob;
  }

  async updateStatus(id, status, info = null) {
    await prisma.queues.update({
      where: { id },
      data: {
        status,
        updated_at: new Date(),
        info: info ? String(info) : null,
      },
    });
  }
}

module.exports = new QueueService();
