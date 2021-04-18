const express = require("express");
const {
  crearEquipo
} = require("../controladores/controlaEquipos");

const { notFoundError } = require("../utils/errors");

const router = express.Router();

router.post("/", async (req, res, next) => {
  const error400 = notFoundError(req);
  if (error400) {
    return next(error400);
  }
  const nuevoEquipo = req.body;
  const { equipo, error } = await crearEquipo(nuevoEquipo);
  if (error) {
    next(error);
  } else {
    res.status(201).json({
      id: nuevoEquipo.id,
      nombre: nuevoEquipo.nombre
    });
  }
});

module.exports = router;
