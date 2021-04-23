const Noticia = require("../db/modelos/noticia");
const { generaError } = require("../utils/errors");
const bucket = require("../utils/bucketfb");

const getNoticias = async () => {
  const noticias = await Noticia.find().sort({ created_at: -1 });
  return noticias;
};

const getNoticia = async id => {
  const noticia = await Noticia.findById(id);
  return noticia;
};

const crearNoticia = async (nuevaNoticia, nuevaImagen) => {
  const respuesta = {
    noticia: null,
    error: null
  };
  const nuevaNoticiaBD = await Noticia.create(nuevaNoticia);
  const archivoMemoria = bucket.file(`noticia_${nuevaNoticiaBD._id}`);
  if (nuevaImagen) {
    const archivoStream = archivoMemoria.createWriteStream({ resumable: false });
    archivoStream.end(nuevaImagen.buffer);
    archivoStream.on("error", err => console.log(err));
    archivoStream.on("finish", () => {
    });
    const noticiaParaPonerLinkImg = await Noticia.findById(nuevaNoticiaBD._id);
    noticiaParaPonerLinkImg.img = {
      link: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/noticia_${nuevaNoticiaBD._id}?alt=media`,
      alt: nuevaNoticia.alt ? nuevaNoticia.alt : "una imagen sin alt"
    };
    noticiaParaPonerLinkImg.save();
    respuesta.noticia = noticiaParaPonerLinkImg;
  } else {
    respuesta.noticia = nuevaNoticiaBD;
  }
  return respuesta;
};

const sustituirNoticia = async (idNoticia, noticiaModificada, nuevaImagen) => {
  const noticiaEncontrada = await Noticia.findById(idNoticia);
  console.log(noticiaEncontrada);
  let link = "";
  if (noticiaEncontrada.img) {
    console.log("entra");
    link = noticiaEncontrada.img.link;
  }
  const respuesta = {
    noticia: null,
    error: null
  };
  if (noticiaEncontrada) {
    await noticiaEncontrada.updateOne(noticiaModificada);
    if (nuevaImagen) {
      respuesta.noticia = noticiaModificada;
      const archivoMemoria = bucket.file(`noticia_${idNoticia}`);
      const archivoStream = archivoMemoria.createWriteStream({ resumable: false });
      archivoStream.end(nuevaImagen.buffer);
      archivoStream.on("error", err => console.log(err));
      archivoStream.on("finish", () => {
      });
      const noticiaParaPonerLinkImg = await Noticia.findById(idNoticia);
      noticiaParaPonerLinkImg.img = {
        link: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/noticia_${idNoticia}?alt=media`,
        alt: noticiaModificada.alt ? noticiaModificada.alt : "una imagen sin alt"
      };
      noticiaParaPonerLinkImg.save();
      respuesta.noticia = noticiaParaPonerLinkImg;
    } else {
      respuesta.noticia = noticiaModificada;
      respuesta.noticia.img = { link };
      const noticiaParaPonerLinkImg = await Noticia.findById(idNoticia);
    }
  }
  return respuesta;
};

const borrarNoticia = async idNoticia => {
  const noticiaEncontrada = await Noticia.findByIdAndDelete(idNoticia);
  const respuesta = {
    noticia: null,
    error: null
  };
  if (noticiaEncontrada) {
    respuesta.noticia = noticiaEncontrada;
    return respuesta;
  }
};

module.exports = {
  getNoticias,
  getNoticia,
  crearNoticia,
  sustituirNoticia,
  borrarNoticia
};
