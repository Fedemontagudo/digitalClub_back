const express = require("express");
const {
  getNoticias,
  getNoticia,
  crearNoticia,
  sustituirNoticia,
} = require("../controladores/controlaNoticias");

const { notFoundError } = require("../utils/errors");

const baseNoticias = noticias => ({
  total: noticias.length,
  datos: noticias
});

const router = express.Router();

router.get("/", async (req, res, next) => {
  const queryParams = req.query;
  const noticiasDevueltas = await getNoticias();
  res.json(baseNoticias(noticiasDevueltas));
});

router.get("/noticia/:idNoticia", async (req, res, next) => {
  const id = req.params.idNoticia;
  console.log("hola");
  const noticia = await getNoticia(id);
  res.json(noticia);
});

router.post("/", async (req, res, next) => {
  const error400 = notFoundError(req);
  if (error400) {
    return next(error400);
  }
  const nuevaNoticia = req.body;
  const { noticia, error } = await crearNoticia(nuevaNoticia);
  if (error) {
    next(error);
  } else {
    res.status(201).json({ id: noticia.id });
  }
});

router.put("/:idNoticia", async (req, res, next) => {
  const { idNoticia } = req.params;
  const noticiaModificada = req.body;
  const { error, noticia } = await sustituirNoticia(idNoticia, noticiaModificada);
  if (error) {
    next(error);
  } else {
    res.json(noticia);
  }
});

module.exports = router;
