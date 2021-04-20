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
    res.status(201).json({
      id: noticia.id,
      titulo: noticia.titulo
    });
  }
});
// hay que meter toda esta mierda dentro del endpoint anterior, si me mandan noticia sin imagen, la subo,
// si me la mandan con imagen, subo la noticia y la imagen
router.post("/archivos",
  multer().single("foto"),
  (req, res, next) => {
    if (req.file) {
      const archivoMemoria = bucket.file(req.file.originalname);
      const archivoStream = archivoMemoria.createWriteStream({ resumable: false });
      console.log(req.file.buffer);
      archivoStream.end(req.file.buffer);
      archivoStream.on("error", err => console.log(err));
      archivoStream.on("finish", () => {
        console.log("Archivo subido");
      });
      res.json("Archivo subido");
    } else {
      res.json("no me has mandado nada");
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
