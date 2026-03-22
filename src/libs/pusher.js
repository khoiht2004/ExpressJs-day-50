const Pusher = require("pusher");
const { pusherConfig } = require("@/config");

const pusher = new Pusher({
  appId: pusherConfig.appId,
  key: pusherConfig.key,
  secret: pusherConfig.secret,
  cluster: "mt1",
  host: "127.0.0.1",
  port: 6002,
  useTLS: false,
});

module.exports = pusher;
