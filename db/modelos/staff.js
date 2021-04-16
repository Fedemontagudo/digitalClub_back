const { Schema, model } = require("mongoose");

const StaffSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  fecha_nacimiento: {
    type: Date,
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
});

const Staff = model("Staff", StaffSchema, "staffs");

module.exports = Staff;
