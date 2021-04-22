require("dotenv").config();
const jwt = require("jsonwebtoken");
const Usuario = require("../db/modelos/usuario");
const { generaError } = require("../utils/errors");

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

module.exports = {
  loginUsuario
};
