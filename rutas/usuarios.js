const express = require("express");
const { crearUsuario } = require("../controladores/controlaUsuarios");

const { notFoundError } = require("../utils/errors");

const router = express.Router();

router.post("/", async (req, res, next) => {
  const error400 = notFoundError(req);
  if (error400) {
    return next(error400);
  }
  const nuevoUsuario = req.body;
  const { usuario, error } = await crearUsuario(nuevoUsuario);
  if (error) {
    next(error);
  } else {
    res.status(201).json({
      id: usuario.id,
      user: usuario.user
    });
  }
});

module.exports = router;
