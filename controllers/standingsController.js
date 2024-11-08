const { Tournament, Team, Match, Result } = require("../models");
const { Op } = require("sequelize");

const getStandings = async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const teams = await Team.findAll({
      where: { id_torneo: tournamentId },
      attributes: ["id", "nombre"],
    });
    const standings = {};

    teams.forEach((team) => {
      standings[team.id] = {
        equipo: team.nombre,
        PJ: 0,
        G: 0,
        E: 0,
        P: 0,
        GF: 0,
        GC: 0,
        DG: 0,
        PTS: 0,
      };
    });
    const matches = await Match.findAll({
      where: { id_torneo: tournamentId },
      include: [{ model: Result, as: "result" }],
    });

    matches.forEach((match) => {
      const localTeamId = match.id_equipo_local;
      const visitorTeamId = match.id_equipo_visitante;
      const result = match.result;

      if (result) {
        const golesLocal = result.goles_local;
        const golesVisitante = result.goles_visitante;

        standings[localTeamId].PJ += 1;
        standings[visitorTeamId].PJ += 1;

        standings[localTeamId].GF += golesLocal;
        standings[localTeamId].GC += golesVisitante;
        standings[visitorTeamId].GF += golesVisitante;
        standings[visitorTeamId].GC += golesLocal;

        standings[localTeamId].DG =
          standings[localTeamId].GF - standings[localTeamId].GC;
        standings[visitorTeamId].DG =
          standings[visitorTeamId].GF - standings[visitorTeamId].GC;

        if (golesLocal > golesVisitante) {
          standings[localTeamId].G += 1;
          standings[visitorTeamId].P += 1;
          standings[localTeamId].PTS += 3;
        } else if (golesLocal < golesVisitante) {
          standings[visitorTeamId].G += 1;
          standings[localTeamId].P += 1;
          standings[visitorTeamId].PTS += 3;
        } else {
          standings[localTeamId].E += 1;
          standings[visitorTeamId].E += 1;
          standings[localTeamId].PTS += 1;
          standings[visitorTeamId].PTS += 1;
        }
      }
    });
    const standingsArray = Object.values(standings);
    standingsArray.sort((a, b) => {
      if (b.PTS !== a.PTS) return b.PTS - a.PTS;
      if (b.DG !== a.DG) return b.DG - a.DG;
      return b.GF - a.GF;
    });

    res.status(200).json({
      message: "Clasificación obtenida exitosamente.",
      standings: standingsArray,
    });
  } catch (error) {
    console.error("Error al obtener la clasificación:", error);
    res.status(500).json({ message: "Error al obtener la clasificación." });
  }
};

module.exports = {
  getStandings,
};
