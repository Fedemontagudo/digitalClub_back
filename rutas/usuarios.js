const express = require("express");
const {
  getUsuarios,
  crearUsuario,
  loginUsuario,
  borrarUsuario
} = require("../controladores/controlaUsuarios");
const Usuario = require("../db/modelos/usuario");

const { notFoundError } = require("../utils/errors");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const usuariosDevueltos = await getUsuarios();
  res.json(usuariosDevueltos);
});

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

router.delete("/:idUsuario", async (req, res, next) => {
  console.log("hola");
  const { idUsuario } = req.params;
  const { error, usuario } = await borrarUsuario(idUsuario);
  if (error) {
    next(error);
  } else {
    res.json(usuario);
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
