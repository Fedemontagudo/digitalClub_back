require("dotenv").config();
const debug = require("debug")("facturas:dbMongo");
const chalk = require("chalk");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://digitalclub:digitalclub@cluster0.l4exx.mongodb.net/digitalclub", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, err => {
  if (err) {
    debug(chalk.red("No se ha podido conectar con la base de datos de Mongo"));
    debug(chalk.red(err));
  }
  debug(chalk.green("Iniciando MongoDB"));
});
