const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  console.log("authMiddleware - req.params antes:", req.params);
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("No token proporcionado o formato incorrecto.");
    return res.status(401).json({ message: "No token proporcionado." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Usuario autenticado:", req.user);
    console.log("authMiddleware - req.params después:", req.params);
    next();
  } catch (error) {
    console.error("Error en la verificación del token:", error);
    res.status(401).json({ message: "Token inválido o expirado." });
  }
};

module.exports = authMiddleware;
