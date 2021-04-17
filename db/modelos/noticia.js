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
  texto: {
    type: String,
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Noticia = model("Noticia", NoticiaSchema, "noticias");

module.exports = Noticia;
