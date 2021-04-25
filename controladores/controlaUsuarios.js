require("dotenv").config();
const jwt = require("jsonwebtoken");
const Usuario = require("../db/modelos/usuario");
const { generaError } = require("../utils/errors");

const getUsuarios = async () => {
  const usuarios = await Usuario.find();
  return usuarios;
};

const crearUsuario = async nuevoUsuario => {
  const respuesta = {
    usuario: null,
    error: null
  };
  const usuarioEncontrado = await Usuario.findOne({
    user: nuevoUsuario.user
  });
  if (usuarioEncontrado) {
    const error = generaError("El usuario ya existe", 409);
    respuesta.error = error;
  } else {
    const nuevoUsuarioBD = await Usuario.create(nuevoUsuario);
    respuesta.usuario = nuevoUsuarioBD;
  }
  return respuesta;
};

const loginUsuario = async (user, password) => {
  const usuarioEncontrado = await Usuario.findOne({
    user,
    password
  });
  const respuesta = {
    error: null,
    usuario: null
  };
  if (!usuarioEncontrado) {
    respuesta.error = generaError("Credenciales erróneas", 403);
  } else {
    const token = jwt.sign({
      id: usuarioEncontrado._id,
      user: usuarioEncontrado.user,
      rol: usuarioEncontrado.rol

    }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    respuesta.usuario = token;
    console.log(token);
  }
  return respuesta;
};

const borrarUsuario = async (idUsuario) => {
  const usuarioEncontrado = await Usuario.findByIdAndDelete(idUsuario);
  const respuesta = {
    usuario: null,
    error: null
  };
  if (usuarioEncontrado) {
    respuesta.usuario = usuarioEncontrado;
    return respuesta;
  }
};

module.exports = {
  getUsuarios,
  crearUsuario,
  loginUsuario,
  borrarUsuario
};
