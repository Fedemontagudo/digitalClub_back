const express = require("express");

const {
  getStaff,
  getOneStaff,
  crearStaff,
  sustituirStaff,
  borrarStaff
} = require("../controladores/controlaStaff");

const { notFoundError } = require("../utils/errors");

const baseStaff = staff => ({
  total: staff.length,
  datos: staff
});

const router = express.Router();

router.get("/", async (req, res, next) => {
  const queryParams = req.query;
  const staffdevuelto = await getStaff();
  res.json(baseStaff(staffdevuelto));
});

router.get("/staff/:idStaff", async (req, res, next) => {
  const id = req.params.idStaff;
  const staff = await getOneStaff(id);
  res.json(staff);
});

router.post("/", async (req, res, next) => {
  const error400 = notFoundError(req);
  if (error400) {
    return next(error400);
  }
  const nuevoStaff = req.body;
  const { staff, error } = await crearStaff(nuevoStaff);
  if (error) {
    next(error);
  } else {
    res.status(201).json({
      id: staff.id,
      nombre: staff.nombre
    });
  }
});

router.put("/:idStaff", async (req, res, next) => {
  const { idStaff } = req.params;
  const StaffModificado = req.body;
  const { error, staff } = await sustituirStaff(idStaff, StaffModificado);
  if (error) {
    next(error);
  } else {
    res.json(staff);
  }
});

router.delete("/:idStaff", async (req, res, next) => {
  const { idStaff } = req.params;
  const { error, staff } = await borrarStaff(idStaff);
  if (error) {
    next(error);
  } else {
    res.json(staff);
  }
});

module.exports = router;
