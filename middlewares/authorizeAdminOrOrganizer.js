const authorizeAdminOrOrganizer = (req, res, next) => {
  console.log("authorizeAdminOrOrganizer - req.params antes:", req.params);
  const { rol } = req.user;

  if (rol === "admin" || rol === "organizer") {
    console.log("Usuario autorizado con rol:", rol);
    console.log("authorizeAdminOrOrganizer - req.params después:", req.params);
    next();
  } else {
    console.error("Acceso denegado. Rol insuficiente:", rol);
    return res
      .status(403)
      .json({ message: "Acceso denegado. Permisos insuficientes." });
  }
};

module.exports = authorizeAdminOrOrganizer;
