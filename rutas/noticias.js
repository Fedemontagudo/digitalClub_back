require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const admin = require("firebase-admin");

const { JsonWebTokenError } = require("jsonwebtoken");
const {
  getNoticias,
  getNoticia,
  crearNoticia,
  sustituirNoticia,
  borrarNoticia,
} = require("../controladores/controlaNoticias");

const { notFoundError, generaError } = require("../utils/errors");
const bucket = require("../utils/bucketfb");

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
  const noticia = await getNoticia(id);
  res.json(noticia);
});

router.post("/", multer().single("foto"),
  /*   (req, res, next) => {
      console.log(req.header("Authorization").split(" ")[1]); // PREGUNTA 1, por que narices no devuelve Bearer + el token? solo devuelve el token wtf
      const token = req.header("Authorization").split(" ")[1];
      try {
        const infoUsuario = jwt.verify(token, process.env.JWT_SECRET);
        console.log(infoUsuario);
      } catch (err) {
        return next(generaError(err.message, 403));
      }
    }, */
  async (req, res, next) => {
    const error400 = notFoundError(req);
    if (error400) {
      return next(error400);
    }
    const nuevaNoticia = req.body;
    const nuevaImagen = req.file;
    if (req.file) {
      if (req.body) {
        const { noticia, error } = await crearNoticia(nuevaNoticia, nuevaImagen);
        res.status(201).json({
          respuesta: noticia
        });
      } else {
        console.log("1111");
        res.json({ respuesta: "no hay body, no puedes mandar una noticia sin titulo, esta prohibo" });
      }
    } else {
      const { noticia, error } = await crearNoticia(nuevaNoticia, nuevaImagen);
      console.log(noticia);
      res.status(201).json({
        respuesta: noticia
      });
    }
  });

router.put("/:idNoticia", multer().single("foto"), async (req, res, next) => {
  const { idNoticia } = req.params;
  const noticiaModificada = req.body;
  const nuevaImagen = req.file;
  const { error, noticia } = await sustituirNoticia(idNoticia, noticiaModificada, nuevaImagen);
  if (error) {
    next(error);
  } else {
    res.json(noticia);
  }
});

router.delete("/:idNoticia", async (req, res, next) => {
  const { idNoticia } = req.params;
  const { error, noticia } = await borrarNoticia(idNoticia);
  if (error) {
    next(error);
  } else {
    res.json(noticia);
  }
});

module.exports = router;
