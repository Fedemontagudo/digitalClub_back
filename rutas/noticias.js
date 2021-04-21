const express = require("express");
const multer = require("multer");
const admin = require("firebase-admin");

const {
  getNoticias,
  getNoticia,
  crearNoticia,
  sustituirNoticia,
  borrarNoticia,
} = require("../controladores/controlaNoticias");

const { notFoundError } = require("../utils/errors");
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

// hay que meter toda esta mierda dentro del endpoint anterior, si me mandan noticia sin imagen, la subo,
// si me la mandan con imagen, subo la noticia y la imagen
/* router.post("/archivos",
  multer().single("foto"),
  (req, res, next) => {
    if (req.file) {
      const archivoMemoria = bucket.file(req.file.originalname);
      const archivoStream = archivoMemoria.createWriteStream({ resumable: false });
      archivoStream.end(req.file.buffer);
      archivoStream.on("error", err => console.log(err));
      archivoStream.on("finish", () => {
      });
      res.json("Archivo subido");
    } else {
      res.json("no me has mandado nada");
    }
  }); */

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
