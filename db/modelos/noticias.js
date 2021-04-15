const { Schema, model } = require("mongoose");

const NoticiaSchema = new Schema({
  titulo: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  create_add: {
    type: Date,
    required: true
  },
  update_add: {
    type: Date,
    required: true
  },
  texto: {
    type: String,
    required: true
  }
});

const Noticia = model("Noticia", NoticiaSchema, "noticias");

module.exports = Noticia;
