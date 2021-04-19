const { Schema, model } = require("mongoose");

const UsuarioSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: Number,
    required: true
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Usuario = model("Usuario", UsuarioSchema, "usuarios");

module.exports = Usuario;
