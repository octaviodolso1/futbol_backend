const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { startOfDay, endOfDay } = require("date-fns");

const registerUser = async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;
  try {
    const existingUser = await User.findOne({ where: { correo } });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    if (rol === "admin" && req.user && req.user.rol !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permiso para crear administradores" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    const newUser = await User.create({
      nombre,
      correo,
      contraseña: hashedPassword,
      rol: rol || "organizer",
    });

    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error });
  }
};
const loginUser = async (req, res) => {
  const { correo, contraseña } = req.body;
  try {
    const user = await User.findOne({ where: { correo } });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Correo o contraseña incorrectos" });
    }

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Correo o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token, rol: user.rol });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el perfil de usuario", error });
  }
};

const getMatchesToday = async (req, res) => {
  try {
    const today = new Date();

    const matches = await Match.findAll({
      where: {
        fecha: {
          [Op.between]: [startOfDay(today), endOfDay(today)],
        },
      },
      include: [
        { model: Team, as: "localTeam", attributes: ["nombre"] },
        { model: Team, as: "visitorTeam", attributes: ["nombre"] },
        { model: Tournament, as: "tournament", attributes: ["nombre"] },
      ],
    });

    if (!matches.length) {
      return res
        .status(404)
        .json({ message: "No hay partidos programados para hoy" });
    }

    res.json(matches);
  } catch (error) {
    console.error("Error al obtener los partidos de hoy:", error);
    res.status(500).json({
      message: "Error al obtener los partidos de hoy",
      error: error.message,
    });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, getMatchesToday };
