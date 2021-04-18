const Equipo = require("../db/modelos/equipo");
const { generaError } = require("../utils/errors");

const crearEquipo = async nuevoEquipo => {
  const respuesta = {
    equipo: null,
    error: null
  };
  const equipoEncontrado = await Equipo.findOne({
    nombre: nuevoEquipo.nombre
  });
  if (equipoEncontrado) {
    const error = generaError("Ya existe este equipo en las base de datos de equipos", 409);
    respuesta.error = error;
  } else {
    const nuevoEquipoBD = await Equipo.create(nuevoEquipo);
    respuesta.jugador = nuevoEquipoBD;
  }
  return respuesta;
};

module.exports = {
  crearEquipo
};
