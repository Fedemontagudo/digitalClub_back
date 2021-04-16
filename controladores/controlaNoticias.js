const Noticia = require("../db/modelos/noticia");
const { generaError } = require("../utils/errors");

const getNoticias = async () => {
  const noticias = await Noticia.find();
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
  const noticiaEncontrada = await Noticia.findOne({
    titulo: nuevaNoticia.titulo
  });
  if (noticiaEncontrada) {
    const error = generaError("Ya existe el proyecto", 409);
    respuesta.error = error;
  } else {
    const nuevaNoticiaBD = await Noticia.create(nuevaNoticia);
    respuesta.noticia = nuevaNoticiaBD;
  }
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

module.exports = {
  getNoticias,
  getNoticia,
  crearNoticia,
  sustituirNoticia
};
