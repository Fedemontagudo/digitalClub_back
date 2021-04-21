const express = require("express");
const multer = require("multer");
const admin = require("firebase-admin");

const {
  getEquipo,
  crearEquipo,
  borrarEquipo,
  sustituirEquipo
} = require("../controladores/controlaEquipos");

const { notFoundError } = require("../utils/errors");

const router = express.Router();

const baseEquipo = equipo => ({
  total: equipo.length,
  datos: equipo
});

router.get("/", async (req, res, next) => {
  const equipoDevuelto = await getEquipo();
  res.json(baseEquipo(equipoDevuelto));
});

router.post("/", multer().single("foto"), async (req, res, next) => {
  const error400 = notFoundError(req);
  if (error400) {
    return next(error400);
  }
  if (req.file) {
    if (req.body) {
      const nuevoEquipo = req.body;
      const nuevaImagen = req.file;

      const { equipo, error } = await crearEquipo(nuevoEquipo, nuevaImagen);
    }
  }
  res.status(201).json({
    hola: "hola"
  });
});

router.put("/:idEquipo", async (req, res, next) => {
  const { idEquipo } = req.params;
  const equipoModificado = req.body;
  const { error, equipo } = await sustituirEquipo(idEquipo, equipoModificado);
  if (error) {
    next(error);
  } else {
    res.json(equipo);
  }
});

router.delete("/:idEquipo", async (req, res, next) => {
  const { idEquipo } = req.params;
  const { error, equipo } = await borrarEquipo(idEquipo);
  if (error) {
    next(error);
  } else {
    res.json(equipo);
  }
});

module.exports = router;
