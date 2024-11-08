const User = require("./User");
const Tournament = require("./Tournament");
const Team = require("./Team");
const Match = require("./Match");
const Result = require("./Result");

Tournament.hasMany(Team, { foreignKey: "tournamentId", as: "teams" });
Team.belongsTo(Tournament, {
  foreignKey: "tournamentId",
  as: "parentTournament",
});
Tournament.hasMany(Match, { foreignKey: "tournamentId", as: "matches" });
Match.belongsTo(Tournament, {
  foreignKey: "tournamentId",
  as: "associatedTournament",
});
Team.hasMany(Match, { foreignKey: "team1Id", as: "homeMatches" });
Team.hasMany(Match, { foreignKey: "team2Id", as: "awayMatches" });
Match.belongsTo(Team, { foreignKey: "team1Id", as: "localTeam" });
Match.belongsTo(Team, { foreignKey: "team2Id", as: "visitorTeam" });
Match.hasOne(Result, { foreignKey: "matchId", as: "result" });
Result.belongsTo(Match, { foreignKey: "matchId", as: "match" });

module.exports = {
  User,
  Tournament,
  Team,
  Match,
  Result,
};
