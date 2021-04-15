require("dotenv").config();
const debug = require("debug")("facturas:index");
const chalk = require("chalk");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const options = require("./utils/parametrosCLI");
const rutasNoticias = require("./rutas/noticias");
const rutasEquipos = require("./rutas/equipos");
const {
  generaError, serverError, notFoundError, generalError
} = require("./utils/errors");
require("./db/dbMongo");

const app = express();

const puerto = options.puerto || process.env.PUERTO || 5000;

const server = app.listen(puerto, () => {
  debug(chalk.yellow.bold(`Servidor levantado en el puerto ${puerto}`));
});

server.on("error", err => serverError(err, puerto));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/noticias", rutasNoticias);
app.use("/equipos", rutasEquipos);
app.use(notFoundError);
app.use(generalError);
