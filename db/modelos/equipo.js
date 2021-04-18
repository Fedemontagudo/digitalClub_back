const { Schema, model } = require("mongoose");

const EquipoSchema = new Schema({
  nombre: {
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
  staff: {
    type: [String],
  },
  jugadores: {
    type: [String],
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Equipo = model("Equipo", EquipoSchema, "equipos");

module.exports = Equipo;
