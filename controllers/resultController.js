const { Result, Match } = require("../models");
const addOrUpdateResult = async (req, res) => {
  const { matchId } = req.params;
  const { goles_local, goles_visitante } = req.body;

  console.log("Datos recibidos en addOrUpdateResult:");
  console.log("goles_local:", goles_local);
  console.log("goles_visitante:", goles_visitante);
  console.log("matchId:", matchId);

  try {
    const match = await Match.findByPk(matchId);
    if (!match) {
      return res.status(404).json({ message: "Partido no encontrado." });
    }

    let result = await Result.findOne({ where: { id_partido: matchId } });

    if (result) {
      await result.update({ goles_local, goles_visitante });
      return res
        .status(200)
        .json({ message: "Resultado actualizado exitosamente.", result });
    } else {
      result = await Result.create({
        id_partido: matchId,
        goles_local,
        goles_visitante,
      });
      return res
        .status(201)
        .json({ message: "Resultado creado exitosamente.", result });
    }
  } catch (error) {
    console.error("Error al agregar o actualizar el resultado:", error);
    res
      .status(500)
      .json({
        message: "Error al agregar o actualizar el resultado.",
        error: error.message,
      });
  }
};

const getResult = async (req, res) => {
  const { matchId } = req.params;

  try {
    const result = await Result.findOne({ where: { id_partido: matchId } });

    if (!result) {
      return res
        .status(404)
        .json({ message: "Resultado no encontrado para este partido." });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener el resultado:", error);
    res
      .status(500)
      .json({
        message: "Error al obtener el resultado.",
        error: error.message,
      });
  }
};

const deleteResult = async (req, res) => {
  const { matchId } = req.params;

  try {
    const result = await Result.findOne({ where: { id_partido: matchId } });

    if (!result) {
      return res
        .status(404)
        .json({ message: "Resultado no encontrado para este partido." });
    }

    await result.destroy();
    res.status(200).json({ message: "Resultado eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar el resultado:", error);
    res
      .status(500)
      .json({
        message: "Error al eliminar el resultado.",
        error: error.message,
      });
  }
};

module.exports = {
  addOrUpdateResult,
  getResult,
  deleteResult,
};
