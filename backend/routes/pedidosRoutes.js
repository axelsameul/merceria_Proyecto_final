const express = require("express");
const router = express.Router();
const { crearPedido } = require("../controllers/pedidosController");

// Ruta para crear un nuevo pedido
router.post("/", crearPedido);

module.exports = router;
