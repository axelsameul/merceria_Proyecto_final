const express = require('express');
const router = express.Router();
const {
  getMovimientos,
  agregarMovimiento,
  getResumen,
  eliminarMovimiento,
  getMovimientoPorId
} = require('../controllers/movimientosController');

// 📋 Obtener todos los movimientos
router.get('/', getMovimientos);

// ➕ Agregar un nuevo movimiento
router.post('/', agregarMovimiento);

// 📊 Obtener resumen contable
router.get('/resumen', getResumen);

// 🔍 Obtener movimiento por ID
router.get('/:id_movimiento', getMovimientoPorId);

// 🗑 Eliminar movimiento
router.delete('/:id_movimiento', eliminarMovimiento);

module.exports = router;
