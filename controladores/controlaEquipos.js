const Equipo = require("../db/modelos/equipo");
const Jugador = require("../db/modelos/jugador");
const Staff = require("../db/modelos/staff");
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

const getUnEquipo = async id => {
  const equipo = await Equipo.findById(id).populate("jugadores")
    .populate("staff");
  return equipo;
};

const crearEquipo = async (nuevoEquipo, jugadores) => {
  const respuesta = {
    equipo: null,
    error: null
  };

  const nuevoEquipoBD = await new Equipo({
    nombre: nuevoEquipo.nombre
  });
  nuevoEquipoBD.save();
  if (nuevoEquipo.jugadores) {
    const arrayJugadores = JSON.parse(nuevoEquipo.jugadores);
    const arrayJugadoresBD = await Jugador.create(
      arrayJugadores.map(jugador => ({
        nombre: jugador.nombre,
        fecha_nacimiento: jugador.nacimiento,
        rol: jugador.rol,
        dorsal: jugador.dorsal
      }))
    );
    arrayJugadoresBD.forEach(jugadorBD => {
      nuevoEquipoBD.jugadores.push(jugadorBD._id);
    });
    nuevoEquipoBD.save();
  }
  if (nuevoEquipo.staff) {
    const arrayStaff = JSON.parse(nuevoEquipo.staff);
    const arrayStaffBD = await Staff.create(
      arrayStaff.map(miembro => ({
        nombre: miembro.nombre,
        fecha_nacimiento: miembro.nacimiento,
        rol: miembro.rol,
      }))
    );
    arrayStaffBD.forEach(miembroBD => {
      nuevoEquipoBD.staff.push(miembroBD._id);
    });
    nuevoEquipoBD.save();
  }
  respuesta.equipo = nuevoEquipoBD;
  return respuesta;
};

const sustituirEquipo = async (idEquipo, equipoModificado, nuevaImagen) => {
  const equipoEncontrado = await Equipo.findById(idEquipo);
  const respuesta = {
    equipo: null,
    error: null
  };
  if (equipoEncontrado) {
    await equipoEncontrado.updateOne(equipoModificado);
    respuesta.equipo = equipoModificado;
    const archivoMemoria = bucket.file(`noticia_${idEquipo}`);
    const archivoStream = archivoMemoria.createWriteStream({ resumable: false });
    archivoStream.end(nuevaImagen.buffer);
    archivoStream.on("error", err => console.log(err));
    archivoStream.on("finish", () => {
    });
    /*     const equipoParaPonerLinkImg = await Equipo.findById(equipoModificado._id);

    noticiaParaPonerLinkImg.img = {
      link: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/noticia_${equipoModificado._id}?alt=media`
    };
    equipoParaPonerLinkImg.save();
    respuesta.equipo = equipoModificado;
    return respuesta; */
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
  getUnEquipo,
  crearEquipo,
  sustituirEquipo,
  borrarEquipo
};
