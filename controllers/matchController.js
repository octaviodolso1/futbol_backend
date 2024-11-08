const { Match, Tournament, Team, Result } = require("../models");
const { Op, fn, col, where } = require("sequelize");
const createMatch = async (req, res) => {
  const { fecha, equipoLocalId, equipoVisitanteId } = req.body;
  const { tournamentId } = req.params;

  try {
    if (!tournamentId) {
      return res
        .status(400)
        .json({ message: "tournamentId es requerido en la ruta." });
    }
    const torneo = await Tournament.findByPk(tournamentId);
    if (!torneo) {
      return res.status(404).json({ message: "Torneo no encontrado." });
    }
    const equipoLocal = await Team.findOne({
      where: { id: equipoLocalId, id_torneo: tournamentId },
    });
    const equipoVisitante = await Team.findOne({
      where: { id: equipoVisitanteId, id_torneo: tournamentId },
    });

    if (!equipoLocal || !equipoVisitante) {
      return res
        .status(404)
        .json({ message: "Uno o ambos equipos no pertenecen al torneo." });
    }
    const match = await Match.create({
      fecha,
      id_equipo_local: equipoLocalId,
      id_equipo_visitante: equipoVisitanteId,
      id_torneo: tournamentId,
    });

    res.status(201).json({
      message: "Partido creado exitosamente.",
      match,
    });
  } catch (error) {
    console.error("Error al crear el partido:", error);
    res
      .status(500)
      .json({ message: "Error al crear el partido.", error: error.message });
  }
};
const getMatchesByTournament = async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const matches = await Match.findAll({
      where: { id_torneo: tournamentId },
      include: [
        { model: Team, as: "localTeam" },
        { model: Team, as: "visitorTeam" },
        { model: Result, as: "result" },
      ],
    });

    res.status(200).json(matches);
  } catch (error) {
    console.error("Error al obtener los partidos del torneo:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los partidos del torneo." });
  }
};
const getMatchById = async (req, res) => {
  const { id, tournamentId } = req.params;

  try {
    const match = await Match.findOne({
      where: { id, id_torneo: tournamentId },
      include: [
        { model: Team, as: "localTeam" },
        { model: Team, as: "visitorTeam" },
        { model: Result, as: "result" },
      ],
    });

    if (!match) {
      return res.status(404).json({ message: "Partido no encontrado." });
    }

    res.status(200).json(match);
  } catch (error) {
    console.error("Error al obtener el partido:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el partido.", error: error.message });
  }
};

const updateMatch = async (req, res) => {
  const { id, tournamentId } = req.params;
  const { fecha, equipoLocalId, equipoVisitanteId } = req.body;

  try {
    const match = await Match.findOne({
      where: { id, id_torneo: tournamentId },
    });

    if (!match) {
      return res.status(404).json({ message: "Partido no encontrado." });
    }

    await match.update({
      fecha: fecha || match.fecha,
      id_equipo_local: equipoLocalId || match.id_equipo_local,
      id_equipo_visitante: equipoVisitanteId || match.id_equipo_visitante,
    });

    res.status(200).json({
      message: "Partido actualizado exitosamente.",
      match,
    });
  } catch (error) {
    console.error("Error al actualizar el partido:", error);
    res
      .status(500)
      .json({
        message: "Error al actualizar el partido.",
        error: error.message,
      });
  }
};

const deleteMatch = async (req, res) => {
  const { id, tournamentId } = req.params;

  try {
    const match = await Match.findOne({
      where: { id, id_torneo: tournamentId },
    });

    if (!match) {
      return res.status(404).json({ message: "Partido no encontrado." });
    }

    await match.destroy();

    res.status(200).json({ message: "Partido eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar el partido:", error);
    res.status(500).json({ message: "Error al eliminar el partido." });
  }
};

const getMatchesByDate = async (req, res) => {
  const { date } = req.query;

  try {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const matches = await Match.findAll({
      where: {
        fecha: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      include: [
        { model: Tournament, as: "relatedTournament" },
        { model: Team, as: "localTeam" },
        { model: Team, as: "visitorTeam" },
        { model: Result, as: "result" },
      ],
    });

    if (!matches.length) {
      return res
        .status(404)
        .json({ message: "No hay partidos para esta fecha" });
    }

    res.status(200).json(matches);
  } catch (error) {
    console.error("Error al obtener los partidos por fecha:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los partidos", error: error.message });
  }
};

module.exports = {
  createMatch,
  getMatchesByTournament,
  getMatchById,
  updateMatch,
  deleteMatch,
  getMatchesByDate,
};
