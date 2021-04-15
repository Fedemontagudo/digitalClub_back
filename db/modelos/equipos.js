const { Schema, model } = require("mongoose");

const EquipoSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  foto: {
    type: String,
    required: true
  },
  staff: {
    type: [
      {
        nombre: {
          type: String,
          required: true
        },
        rol: {
          type: String,
          required: true
        }
      }
    ],
    required: true
  },
  jugadores: {
    type: [
      {
        nombre: {
          type: String,
          required: true
        },
        dorsal: {
          type: Number,
          required: true
        },
        rol: {
          type: String,
          required: true
        },
        create_add: {
          type: Date,
        }
      }
    ]
  }
});

const Equipo = model("Equipo", EquipoSchema, "equipos");
