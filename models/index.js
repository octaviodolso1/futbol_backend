const sequelize = require('../config/database');
const User = require('./User');
const Tournament = require('./Tournament');
const Team = require('./Team');
const Match = require('./Match');
const Result = require('./Result');

Tournament.hasMany(Team, { foreignKey: 'id_torneo', as: 'teams' });
Team.belongsTo(Tournament, { foreignKey: 'id_torneo', as: 'associatedTournament' });
Tournament.hasMany(Match, { foreignKey: 'id_torneo', as: 'matches' });
Match.belongsTo(Tournament, { foreignKey: 'id_torneo', as: 'relatedTournament' });
Team.hasMany(Match, { foreignKey: 'id_equipo_local', as: 'homeMatches' });
Match.belongsTo(Team, { foreignKey: 'id_equipo_local', as: 'localTeam' });
Team.hasMany(Match, { foreignKey: 'id_equipo_visitante', as: 'awayMatches' });
Match.belongsTo(Team, { foreignKey: 'id_equipo_visitante', as: 'visitorTeam' });
Match.hasOne(Result, { foreignKey: 'id_partido', as: 'result' });
Result.belongsTo(Match, { foreignKey: 'id_partido', as: 'relatedMatch' });

module.exports = {
  sequelize,
  User,
  Tournament,
  Team,
  Match,
  Result,
  syncDatabase: async () => {
    try {
      await sequelize.sync({ alter: true });
      console.log('Modelos sincronizados con la base de datos.');
    } catch (error) {
      console.error('Error al sincronizar la base de datos:', error);
    }
  },
};
