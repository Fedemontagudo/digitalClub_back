const debug = require("debug")("digitalclub:error");
const chalk = require("chalk");
const { validationResult } = require("express-validator");

const generaError = (mensaje, status) => {
  const error = new Error(mensaje);
  error.codigo = status;
  return error;
};
const serverError = (err, puerto) => {
  debug(chalk.red.bold("Ha ocurrido un error en el servidor"));
  if (err.code === "EADDRINUSE") {
    debug(chalk.red.bold(`El puerto ${puerto} está ocupado.`));
  }
};
const notFoundError = (req, res, next) => {
  const error = generaError("El endpoint no existe", 404);
};

const generalError = (err, req, res, next) => {
  const error = {
    codigo: err.codigo || 500,
    mensaje: err.codigo ? err.message : "Ha ocurrido un error general"
  };
  res.status(error.codigo).json({ error: true, mensaje: error.mensaje });
  console.log(err);
};

module.exports = {
  generaError,
  serverError,
  notFoundError,
  generalError
};
