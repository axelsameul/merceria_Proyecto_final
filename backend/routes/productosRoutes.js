const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // carga simple

const {
  getProductoPorId,
  getCategorias,
  getProductosPorCategoria,
  getProductosConCategoria,
  agregarProducto,
  editarProducto,
  eliminarProducto
} = require('../controllers/productosController');

// -------------------
// Categorías
// -------------------
router.get('/categorias', getCategorias);

// -------------------
// Productos
// -------------------

// ✅ Cambiamos el parámetro para usar "id" en lugar de "id_producto"
router.get('/producto-detalle/:id', getProductoPorId);
router.get('/categoria/:id_categoria', getProductosPorCategoria);
router.get('/', getProductosConCategoria);

// -------------------
// Admin
// -------------------
router.post("/agregar", upload.single("imagen"), agregarProducto);
router.put("/editar/:id", upload.single("imagen"), editarProducto);
router.delete("/eliminar/:id", eliminarProducto);

module.exports = router;
