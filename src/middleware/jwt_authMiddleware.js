const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ status: "failed", message: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1]; // Remove "Bearer" prefix
  console.log(token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(403)
      .json({ status: "failed", message: "Unauthorized: Invalid token" });
  }
};

module.exports = verifyToken;
