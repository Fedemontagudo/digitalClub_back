const express = require("express");
const { crearUsuario } = require("../controladores/controlaUsuarios");
const { loginUsuario } = require("../controladores/usuarios");
const Usuario = require("../db/modelos/usuario");

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

router.post("/login", async (req, res, next) => {
  const { user, password } = req.body;
  const { error, usuario } = await loginUsuario(user, password);
  if (error) {
    next(error);
  } else {
    res.json({ token: usuario });
  }
});

module.exports = router;
