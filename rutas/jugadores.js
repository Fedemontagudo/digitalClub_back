const express = require("express");

const {
  getJugadores,
  getOneJugador,
  crearJugador,
  sustituirJugador,
  borrarJugador
} = require("../controladores/controlaJugadores");

const { notFoundError } = require("../utils/errors");

const baseJugador = jugador => ({
  total: jugador.length,
  datos: jugador
});

const router = express.Router();

router.get("/", async (req, res, next) => {
  const queryParams = req.query;
  const jugadorDevuelto = await getJugadores();
  res.json(baseJugador(jugadorDevuelto));
});

router.get("/jugador/:idJugador", async (req, res, next) => {
  const id = req.params.idJugador;
  const jugador = await getOneJugador(id);
  res.json(jugador);
});

router.post("/", async (req, res, next) => {
  const error400 = notFoundError(req);
  if (error400) {
    return next(error400);
  }
  const nuevoJugador = req.body;
  const { jugador, error } = await crearJugador(nuevoJugador);
  if (error) {
    next(error);
  } else {
    res.status(201).json({
      id: jugador.id,
      nombre: jugador.nombre
    });
  }
});

router.put("/:idJugador", async (req, res, next) => {
  const { idJugador } = req.params;
  const jugadorModificado = req.body;
  const { error, jugador } = await sustituirJugador(idJugador, jugadorModificado);
  if (error) {
    next(error);
  } else {
    res.json(jugador);
  }
});

router.delete("/:idJugador", async (req, res, next) => {
  const { idJugador } = req.params;
  const { error, jugador } = await borrarJugador(idJugador);
  if (error) {
    next(error);
  } else {
    res.json(jugador);
  }
});

module.exports = router;
