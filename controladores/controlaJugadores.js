const Equipo = require("../db/modelos/equipo");
const Jugador = require("../db/modelos/jugador");
const { generaError } = require("../utils/errors");

const getJugadores = async () => {
  const jugador = await Jugador.find().sort({ created_at: -1 });
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
  const nuevoJugadorBD = await Jugador.create(nuevoJugador);
  const idJugador = nuevoJugadorBD.id;
  const idEquipo = nuevoJugador.equipo;
  const jugadorIdEquipo = await Equipo.findByIdAndUpdate(
    idEquipo,
    { $push: { jugadores: idJugador } }
  );
  respuesta.jugador = nuevoJugadorBD;

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

const borrarJugador = async idJugador => {
  const jugadorEncontrado = await Jugador.findByIdAndDelete(idJugador);
  const respuesta = {
    jugador: null,
    error: null
  };
  if (jugadorEncontrado) {
    respuesta.jugador = jugadorEncontrado;
    const idJugadorABorrar = jugadorEncontrado.id;
    const idEquipo = jugadorEncontrado.equipo;
    const jugadorIdEquipo = await Equipo.findByIdAndUpdate(
      idEquipo,
      { $pull: { jugadores: idJugador } }
    );
    return respuesta;
  }
};

module.exports = {
  getJugadores,
  getOneJugador,
  crearJugador,
  sustituirJugador,
  borrarJugador
};
