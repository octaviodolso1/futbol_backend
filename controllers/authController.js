const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

const register = async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  try {
    const existingUser = await User.findOne({ where: { correo } });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const newUser = await User.create({
      nombre,
      correo,
      contraseña: hashedPassword,
      rol,
    });

    res
      .status(201)
      .json({ message: "Usuario registrado exitosamente.", user: newUser });
  } catch (error) {
    console.error("Error en el registro:", error);
    res
      .status(500)
      .json({
        message: "Error en el registro del usuario.",
        error: error.message,
      });
  }
};
const login = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const user = await User.findOne({ where: { correo } });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Correo o contraseña inválidos." });
    }
    console.log("Contraseña almacenada (hashed):", user.contraseña);
    if (!user.contraseña) {
      return res
        .status(500)
        .json({
          message: "Error interno: Contraseña no encontrada para este usuario.",
        });
    }
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Correo o contraseña inválidos." });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const userResponse = {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
    };

    res.json({
      message: "Inicio de sesión exitoso.",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res
      .status(500)
      .json({ message: "Error en el inicio de sesión.", error: error.message });
  }
};

const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: ["id", "nombre", "correo", "rol"],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el perfil.", error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
