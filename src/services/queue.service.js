const prisma = require("@/libs/prisma");

class QueueService {
  async push(type, payload, isPriority = 0) {
    const jsonPayload = JSON.stringify(payload);
    await prisma.queue.create({
      data: {
        type,
        payload: jsonPayload,
        isPriority: isPriority,
      },
    });
  }

  async getPendingJobs() {
    const firstJob = await prisma.queue.findFirst({
      where: {
        status: "pending",
      },
      orderBy: [{ isPriority: "desc" }, { id: "asc" }],
    });
    return firstJob;
  }

  async updateStatus(id, status, info = null) {
    await prisma.queue.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
        info: info ? String(info) : null,
      },
    });
  }
}

module.exports = new QueueService();
