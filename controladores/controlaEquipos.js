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

const crearEquipo = async (nuevoEquipo, nuevaImagen) => {
  const respuesta = {
    equipo: null,
    error: null
  };

  const nuevoEquipoBD = await new Equipo({
    nombre: nuevoEquipo.nombre
  });
  const archivoMemoria = bucket.file(`equipo_${nuevoEquipoBD._id}`);
  if (nuevoEquipo.jugadores) {
    const arrayJugadores = JSON.parse(nuevoEquipo.jugadores);
    const arrayJugadoresBD = await Jugador.create(
      arrayJugadores.map(jugador => ({
        nombre: jugador.nombre,
        fecha_nacimiento: jugador.fecha_nacimiento,
        rol: jugador.rol,
        dorsal: jugador.dorsal
      }))
    );
    arrayJugadoresBD.forEach(jugadorBD => {
      nuevoEquipoBD.jugadores.push(jugadorBD._id);
    });
  }
  if (nuevoEquipo.staff) {
    const arrayStaff = JSON.parse(nuevoEquipo.staff);
    const arrayStaffBD = await Staff.create(
      arrayStaff.map(miembro => ({
        nombre: miembro.nombre,
        fecha_nacimiento: miembro.fecha_nacimiento,
        rol: miembro.rol,
      }))
    );
    arrayStaffBD.forEach(miembroBD => {
      nuevoEquipoBD.staff.push(miembroBD._id);
    });
  }
  if (nuevaImagen) {
    const archivoStream = archivoMemoria.createWriteStream({ resumable: false });
    archivoStream.end(nuevaImagen.buffer);
    archivoStream.on("error", err => console.log(err));
    archivoStream.on("finish", () => {
    });
    nuevoEquipoBD.img = {
      link: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/equipo_${nuevoEquipoBD._id}?alt=media`,
      alt: nuevoEquipo.alt ? nuevoEquipo.alt : "una imagen sin alt"
    };
    respuesta.noticia = nuevoEquipoBD;
  }
  nuevoEquipoBD.save();
  respuesta.equipo = nuevoEquipoBD;
  return respuesta;
};

const sustituirEquipo = async (idEquipo, equipoModificado, nuevaImagen) => {
  const equipoEncontrado = await Equipo.findById(idEquipo);
  equipoEncontrado.nombre = equipoModificado.nombre;
  const respuesta = {
    equipo: null,
    error: null
  };
  if (equipoEncontrado) {
    if (equipoModificado.jugadores) {
      const arrayJugadores = JSON.parse(equipoModificado.jugadores);
      const arrayJugadoresCrear = arrayJugadores.filter(jugador => jugador._id.includes("uuid_"))
        .map(jugador => ({
          nombre: jugador.nombre,
          fecha_nacimiento: jugador.fecha_nacimiento,
          rol: jugador.rol,
          dorsal: parseInt(jugador.dorsal, 10),
        }));
      if (arrayJugadoresCrear.length !== 0) {
        const arrayJugadoresBD = await Jugador.create(arrayJugadoresCrear);
        arrayJugadoresBD.forEach(jugadorBD => {
          equipoEncontrado.jugadores.push(jugadorBD._id);
        });
      }
      arrayJugadores.forEach(jugador => {
        if (!jugador._id.includes("uuid_")) {
          const jugadorEncontrado = Jugador.findOneAndReplace({ _id: jugador._id }, {
            nombre: jugador.nombre,
            dorsal: parseInt(jugador.dorsal, 10),
            fecha_nacimiento: jugador.fecha_nacimiento,
            rol: jugador.rol,
          });
          Promise.all([jugadorEncontrado]).then(values => {
          });
        }
      });
    }
    if (equipoModificado.staff) {
      const arrayStaff = JSON.parse(equipoModificado.staff);
      const arrayStaffCrear = arrayStaff.filter(miembro => miembro._id.includes("uuid_"))
        .map(miembro => ({
          nombre: miembro.nombre,
          fecha_nacimiento: miembro.fecha_nacimiento,
          rol: miembro.rol,
        }));
      if (arrayStaffCrear.length !== 0) {
        const arrayStaffBD = await Staff.create(arrayStaffCrear);
        arrayStaffBD.forEach(miembroBD => {
          equipoEncontrado.staff.push(miembroBD._id);
        });
      }
      arrayStaff.forEach(miembro => {
        if (!miembro._id.includes("uuid_")) {
          const MiembroEncontrado = Staff.findOneAndReplace({ _id: miembro._id }, {
            nombre: miembro.nombre,
            fecha_nacimiento: miembro.fecha_nacimiento,
            rol: miembro.rol,
          });
          Promise.all([MiembroEncontrado]).then(values => {
          });
        }
      });
    }

    if (nuevaImagen) {
      const archivoMemoria = bucket.file(`equipo_${idEquipo}`);
      const archivoStream = archivoMemoria.createWriteStream({ resumable: false });
      archivoStream.end(nuevaImagen.buffer);
      archivoStream.on("error", err => console.log(err));
      archivoStream.on("finish", () => {
      });
      equipoEncontrado.img = {
        link: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/equipo_${idEquipo}?alt=media`,
        alt: equipoModificado.alt ? equipoModificado.alt : "una imagen sin alt"
      };
    }
  }
  respuesta.equipo = equipoEncontrado;
  equipoEncontrado.save();
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
