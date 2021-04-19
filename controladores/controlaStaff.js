const Staff = require("../db/modelos/staff");
const { generaError } = require("../utils/errors");

const getStaff = async () => {
  const staff = await Staff.find().sort({ date: -1 });
  return staff;
};

const getOneStaff = async id => {
  const oneStaff = await Staff.findById(id);
  return oneStaff;
};

const crearStaff = async nuevoStaff => {
  const respuesta = {
    staff: null,
    error: null
  };
  const staffEncontrado = await Staff.findOne({
    titulo: nuevoStaff.nombre
  });
  if (staffEncontrado) {
    const error = generaError("Ya existe esta persona en el staff team", 409);
    respuesta.error = error;
  } else {
    const nuevoStaffBD = await Staff.create(nuevoStaff);
    respuesta.staff = nuevoStaffBD;
  }
  return respuesta;
};

const sustituirStaff = async (idStaff, StaffModificado) => {
  const staffEncontrado = await Staff.findById(idStaff);
  const respuesta = {
    staff: null,
    error: null
  };
  if (staffEncontrado) {
    await staffEncontrado.updateOne(StaffModificado);
    respuesta.staff = StaffModificado;
  } else {
    const { error, staff } = await crearStaff(StaffModificado);
    if (error) {
      respuesta.error = error;
    } else {
      respuesta.staff = staff;
    }
  }
  return respuesta;
};

module.exports = {
  getStaff,
  getOneStaff,
  crearStaff,
  sustituirStaff
};
