const express = require("express");
const { getNoticias } = require("../controladores/controlaNoticas");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const queryParams = req.query;
  const noticiasDevueltas = await getNoticias();
  res.json(noticiasDevueltas);
});

module.exports = router;
