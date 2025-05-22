const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Access denied, Invalid token",
      success: false
    });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(data)
    req.user = data
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid token",
      success: false
    });
  }
};

module.exports = { verifyToken };
