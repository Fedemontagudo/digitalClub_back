const { Schema, model } = require("mongoose");

const NoticiaSchema = new Schema({
  titulo: {
    type: String,
    required: true
  },
  img: {
    type: {
      link: {
        type: String,
        required: true
      },
      alt: {
        type: String,
        required: true
      }
    }
  },
  create_add: {
    type: Number,
    required: true
  },
  update_add: {
    type: Number,
    required: true
  },
  texto: {
    type: String,
    required: true
  }
});

const Noticia = model("Noticia", NoticiaSchema, "noticias");

module.exports = Noticia;
