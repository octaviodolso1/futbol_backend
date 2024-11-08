const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Team = sequelize.define(
  "Team",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ciudad: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "teams",
    timestamps: false,
  }
);

module.exports = Team;
