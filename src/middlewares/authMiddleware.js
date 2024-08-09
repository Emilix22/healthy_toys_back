const jwt = require("jsonwebtoken");
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authorization = req.get("authorization");
  let token = "";

  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    token = authorization.substring(7);
  }

  let decodeToken = {};
  try {
    decodeToken = jwt.verify(token, process.env.SECRET_TOKEN);
  } catch (e) {}

  if (!token || !decodeToken.id_users) {
    return res.status(401).json({ error: "Token perdido o inválido" });
  }

  req.id_users = decodeToken.id_users;
  req.privileges_id = decodeToken.privileges_id
  next()
};

module.exports = authMiddleware;
