const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Result = sequelize.define(
  "Result",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_partido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "matches",
        key: "id",
      },
      unique: true,
    },
    goles_local: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    goles_visitante: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "results",
    timestamps: false,
  }
);

module.exports = Result;
