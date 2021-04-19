const Usuario = require("../db/modelos/usuario");
const { generaError } = require("../utils/errors");

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

module.exports = {
  crearUsuario
};
