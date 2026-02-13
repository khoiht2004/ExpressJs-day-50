const model = require("@/models/user.model");

async function searchUserByEmail(req, res) {
  const { q } = req.query;
  const currentUserEmail = req.currentUser.email;

  if (!currentUserEmail) return res.error(401, "Unauthorized");

  if (currentUserEmail === q)
    return res.error(400, "You can not search yourself");

  const users = await model.searchUserByEmail(currentUserEmail, q);
  const user = users[0];

  if (!user) return res.error(404, "Users not found");

  return res.success(200, user);
}

module.exports = { searchUserByEmail };
