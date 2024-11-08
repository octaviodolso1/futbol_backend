const { Team, Tournament, Match } = require("../models");
const getTeamsByTournament = async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const teams = await Team.findAll({
      where: { id_torneo: tournamentId },
      include: [{ model: Tournament, as: "associatedTournament" }],
    });

    res.status(200).json(teams);
  } catch (error) {
    console.error("Error al obtener los equipos del torneo:", error);
    res
      .status(500)
      .json({
        message: "Error al obtener los equipos del torneo.",
        error: error.message,
      });
  }
};
const addTeamToTournament = async (req, res) => {
  const { tournamentId } = req.params;
  const { nombre, ciudad } = req.body;

  try {
    const torneo = await Tournament.findByPk(tournamentId);
    if (!torneo) {
      return res.status(404).json({ message: "Torneo no encontrado." });
    }
    const nuevoEquipo = await Team.create({
      nombre,
      ciudad,
      id_torneo: tournamentId,
    });

    res
      .status(201)
      .json({
        message: "Equipo agregado exitosamente al torneo.",
        team: nuevoEquipo,
      });
  } catch (error) {
    console.error("Error al agregar el equipo al torneo:", error);
    res
      .status(500)
      .json({
        message: "Error al agregar el equipo al torneo.",
        error: error.message,
      });
  }
};
const updateTeam = async (req, res) => {
  const { tournamentId, id } = req.params;
  const { nombre, ciudad } = req.body;

  try {
    const team = await Team.findOne({ where: { id, id_torneo: tournamentId } });

    if (!team) {
      return res
        .status(404)
        .json({ message: "Equipo no encontrado en este torneo." });
    }

    await team.update({
      nombre: nombre || team.nombre,
      ciudad: ciudad || team.ciudad,
    });

    res.status(200).json({ message: "Equipo actualizado exitosamente.", team });
  } catch (error) {
    console.error("Error al actualizar el equipo:", error);
    res
      .status(500)
      .json({
        message: "Error al actualizar el equipo.",
        error: error.message,
      });
  }
};
const deleteTeam = async (req, res) => {
  const { tournamentId, id } = req.params;

  try {
    const team = await Team.findOne({ where: { id, id_torneo: tournamentId } });

    if (!team) {
      return res
        .status(404)
        .json({ message: "Equipo no encontrado en este torneo." });
    }

    await team.destroy();

    res.status(200).json({ message: "Equipo eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar el equipo:", error);
    res
      .status(500)
      .json({ message: "Error al eliminar el equipo.", error: error.message });
  }
};

module.exports = {
  getTeamsByTournament,
  addTeamToTournament,
  updateTeam,
  deleteTeam,
};
