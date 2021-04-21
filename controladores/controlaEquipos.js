const Equipo = require("../db/modelos/equipo");
const bucket = require("../utils/bucketfb");
const { generaError } = require("../utils/errors");

const getEquipo = async () => {
  const equipo = await Equipo
    .find()
    .sort({ created_at: -1 })
    .populate("jugadores")
    .populate("staff");
  return equipo;
};

const crearEquipo = async (nuevoEquipo, nuevaImagen) => {
  const respuesta = {
    equipo: null,
    error: null
  };
  const nuevoEquipoBD = await Equipo.create(nuevoEquipo);
  const archivoMemoria = bucket.file(`equipo_${nuevoEquipoBD._id}`);
  const archivoStream = archivoMemoria.createWriteStream({ resumable: false });
  archivoStream.end(nuevoEquipo.buffer);
  archivoStream.on("error", err => console.log(err));
  archivoStream.on("finish", () => {
  });
  const equipoParaPonerLinkImg = await Equipo.findById(nuevoEquipoBD._id);
  equipoParaPonerLinkImg.img = {
    link: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/noticia_${nuevoEquipoBD._id}?alt=media`
  };
  equipoParaPonerLinkImg.save();
  respuesta.equipo = nuevoEquipoBD;
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
