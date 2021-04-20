const Equipo = require("../db/modelos/equipo");
const { generaError } = require("../utils/errors");

const getEquipo = async () => {
  const equipo = await Equipo
    .find()
    .sort({ created_at: -1 })
    .populate("jugadores")
    .populate("staff");
  return equipo;
};

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

const sustituirEquipo = async (idEquipo, equipoModificado) => {
  const equipoEncontrado = await Equipo.findById(idEquipo);
  const respuesta = {
    equipo: null,
    error: null
  };
  if (equipoEncontrado) {
    await equipoEncontrado.updateOne(equipoModificado);
    respuesta.jugador = equipoModificado;
  } else {
    const { error, equipo } = await crearEquipo(equipoModificado);
    if (error) {
      respuesta.error = error;
    } else {
      respuesta.equipo = equipo;
    }
  }
  return respuesta;
};

const borrarEquipo = async idEquipo => {
  const equipoEncontrado = await Equipo.findByIdAndDelete(idEquipo);
  const respuesta = {
    equipo: null,
    error: null
  };
  if (equipoEncontrado) {
    respuesta.equipo = equipoEncontrado;
    return respuesta;
  }
};

module.exports = {
  getEquipo,
  crearEquipo,
  sustituirEquipo,
  borrarEquipo
};
