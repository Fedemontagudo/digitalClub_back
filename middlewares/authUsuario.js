const jwt = require("jsonwebtoken");
const { generaError } = require("../utils/errors");.


const authUsuario = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  try {
    const infoUsuario = jwt.verify(token, process.env.JWT_SECRET);
    req.idUsuario = infoUsuario.id;
    next();
  } catch (err) {
    return next(generaError(err.message, 403));
  }
};

module.exports = authUsuario;
