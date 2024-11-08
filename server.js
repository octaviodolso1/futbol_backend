require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { syncDatabase } = require("./models");
const authRoutes = require("./routes/authRoutes");
const tournamentRoutes = require("./routes/tournamentRoutes");
const teamRoutes = require("./routes/teamRoutes");
const matchRoutes = require("./routes/matchRoutes");
const standingsRoutes = require("./routes/standingsRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/users", authRoutes);
app.use("/tournaments", tournamentRoutes);
app.use("/tournaments/:tournamentId/teams", teamRoutes);
app.use("/tournaments/:tournamentId/matches", matchRoutes);
app.use("/matches", matchRoutes);
app.use("/standings", standingsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada." });
});

const PORT = process.env.PORT || 3000;

syncDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});
