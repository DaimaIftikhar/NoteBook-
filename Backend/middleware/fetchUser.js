const jwt = require('jsonwebtoken');
const JWT_Secret = "daimaisagood@girl";

const fetchUser = (req, res, next) => {
  // Get the user from JWT token and add id to req object
  const token = req.header("auth-token");
  
  if (!token) {
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_Secret);
    console.log("Decoded token data:", data);  // Debug: Log the decoded data
    req.user = data;  // Attach the entire data object (including the id if present)
    next();
  } catch (error) {
    console.error("Token verification error:", error);  // Debug: Log the error
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchUser;
