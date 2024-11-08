const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Match = sequelize.define(
  "Match",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    id_equipo_local: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "teams",
        key: "id",
      },
    },
    id_equipo_visitante: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "teams",
        key: "id",
      },
    },
    id_torneo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tournaments",
        key: "id",
      },
    },
  },
  {
    tableName: "matches",
    timestamps: false,
  }
);

module.exports = Match;
