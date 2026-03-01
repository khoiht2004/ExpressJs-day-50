const model = require("@/models/user.model");

async function searchUserByEmail(req, res) {
  const { q } = req.query;
  const currentUserEmail = req.auth.user.email;

  if (!currentUserEmail) return res.error(401, "Unauthorized");

  if (currentUserEmail === q)
    return res.error(400, "You can not search yourself");

  const users = await model.searchUserByEmail(currentUserEmail, q);

  if (!users || users.length === 0) return res.success(200, []);

  return res.success(200, users);
}

module.exports = { searchUserByEmail };
