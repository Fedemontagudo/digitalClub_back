const { Schema, model } = require("mongoose");

const StaffSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  fecha_nacimiento: {
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

const Staff = model("Staff", StaffSchema, "staff");

module.exports = Staff;
