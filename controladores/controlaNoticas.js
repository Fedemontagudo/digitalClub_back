const Noticia = require("../db/modelos/noticias");

const getNoticias = async () => {
  const noticias = await Noticia.find();
  return noticias;
};

module.exports = {
  getNoticias
};
