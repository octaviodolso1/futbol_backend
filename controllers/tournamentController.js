const { Tournament, Team, Match } = require("../models");
const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.findAll({
      include: [
        { model: Team, as: "teams" },
        { model: Match, as: "matches" },
      ],
    });
    res.status(200).json(tournaments);
  } catch (error) {
    console.error("Error al obtener los torneos:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los torneos.", error: error.message });
  }
};
const createTournament = async (req, res) => {
  const { nombre, fecha_inicio, fecha_fin, ubicacion } = req.body;

  try {
    const nuevoTorneo = await Tournament.create({
      nombre,
      fecha_inicio,
      fecha_fin,
      ubicacion,
    });
    res
      .status(201)
      .json({ message: "Torneo creado exitosamente.", torneo: nuevoTorneo });
  } catch (error) {
    console.error("Error al crear el torneo:", error);
    res
      .status(500)
      .json({ message: "Error al crear el torneo.", error: error.message });
  }
};

const getTournamentById = async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const torneo = await Tournament.findByPk(tournamentId, {
      include: [
        { model: Team, as: "teams" },
        { model: Match, as: "matches" },
      ],
    });

    if (!torneo) {
      return res.status(404).json({ message: "Torneo no encontrado." });
    }

    res.status(200).json(torneo);
  } catch (error) {
    console.error("Error al obtener el torneo:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el torneo.", error: error.message });
  }
};

const updateTournament = async (req, res) => {
  const { tournamentId } = req.params;
  const { nombre, fecha_inicio, fecha_fin, ubicacion } = req.body;

  console.log("Datos recibidos para actualizar torneo:", {
    tournamentId,
    nombre,
    fecha_inicio,
    fecha_fin,
    ubicacion,
  });
  console.log("Usuario autenticado:", req.user);

  try {
    const torneo = await Tournament.findByPk(tournamentId);

    if (!torneo) {
      return res.status(404).json({ message: "Torneo no encontrado." });
    }

    await torneo.update({
      nombre: nombre || torneo.nombre,
      fecha_inicio: fecha_inicio || torneo.fecha_inicio,
      fecha_fin: fecha_fin || torneo.fecha_fin,
      ubicacion: ubicacion || torneo.ubicacion,
    });

    res
      .status(200)
      .json({ message: "Torneo actualizado exitosamente.", torneo });
  } catch (error) {
    console.error("Error al actualizar el torneo:", error);
    res
      .status(500)
      .json({
        message: "Error al actualizar el torneo.",
        error: error.message,
      });
  }
};

const deleteTournament = async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const torneo = await Tournament.findByPk(tournamentId);

    if (!torneo) {
      return res.status(404).json({ message: "Torneo no encontrado." });
    }

    await torneo.destroy();

    res.status(200).json({ message: "Torneo eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar el torneo:", error);
    res
      .status(500)
      .json({ message: "Error al eliminar el torneo.", error: error.message });
  }
};

module.exports = {
  getAllTournaments,
  createTournament,
  getTournamentById,
  updateTournament,
  deleteTournament,
};
