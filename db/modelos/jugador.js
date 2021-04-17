const { Schema, model } = require("mongoose");

const JugadorSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  fecha_nacimiento: {
    type: String,
    required: true
  },
  dorsal: {
    type: Number,
    required: true
  },
  rol: {
    type: String,
    require: true
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
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Jugador = model("Jugador", JugadorSchema, "jugadores");

module.exports = Jugador;
