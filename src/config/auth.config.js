const auth = {
  jwtSecret: process.env.AUTH_JWT_SECRET,
  verifyJwtSecret: process.env.AUTH_VERIFICATION_JWT_SECRET,
};

module.exports = auth;
