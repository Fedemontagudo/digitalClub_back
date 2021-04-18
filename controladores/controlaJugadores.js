const Jugador = require("../db/modelos/jugador");
const { generaError } = require("../utils/errors");

const getJugadores = async () => {
  const jugador = await Jugador.find();
  return jugador;
};

const getOneJugador = async id => {
  const oneJugador = await Jugador.findById(id);
  return oneJugador;
};

const crearJugador = async nuevoJugador => {
  const respuesta = {
    jugador: null,
    error: null
  };
  const jugadorEncontrado = await Jugador.findOne({
    titulo: nuevoJugador.nombre
  });
  if (jugadorEncontrado) {
    const error = generaError("Ya existe este jugador en la lista de equipos", 409);
    respuesta.error = error;
  } else {
    const nuevoJugadorBD = await Jugador.create(nuevoJugador);
    respuesta.jugador = nuevoJugadorBD;
  }
  return respuesta;
};

const sustituirJugador = async (idJugador, jugadorModificado) => {
  const jugadorEncontrado = await Jugador.findById(idJugador);
  const respuesta = {
    jugador: null,
    error: null
  };
  if (jugadorEncontrado) {
    await jugadorEncontrado.updateOne(jugadorModificado);
    respuesta.jugador = jugadorModificado;
  } else {
    const { error, jugador } = await crearJugador(jugadorModificado);
    if (error) {
      respuesta.error = error;
    } else {
      respuesta.jugador = jugador;
    }
  }
  return respuesta;
};

module.exports = {
  getJugadores,
  getOneJugador,
  crearJugador,
  sustituirJugador
};
