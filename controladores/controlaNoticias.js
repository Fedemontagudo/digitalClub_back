const Noticia = require("../db/modelos/noticia");
const { generaError } = require("../utils/errors");

const getNoticias = async () => {
  const noticias = await Noticia.find().sort({ created_at: -1 });
  return noticias;
};

const getNoticia = async id => {
  const noticia = await Noticia.findById(id);
  return noticia;
};

const crearNoticia = async nuevaNoticia => {
  const respuesta = {
    noticia: null,
    error: null
  };
  const nuevaNoticiaBD = await Noticia.create(nuevaNoticia);
  respuesta.noticia = nuevaNoticiaBD;
  return respuesta;
};

const sustituirNoticia = async (idNoticia, noticiaModificada) => {
  const noticiaEncontrada = await Noticia.findById(idNoticia);
  const respuesta = {
    noticia: null,
    error: null
  };
  if (noticiaEncontrada) {
    await noticiaEncontrada.updateOne(noticiaModificada);
    respuesta.noticia = noticiaModificada;
  } else {
    const { error, noticia } = await crearNoticia(noticiaModificada);
    if (error) {
      respuesta.error = error;
    } else {
      respuesta.noticia = noticia;
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
