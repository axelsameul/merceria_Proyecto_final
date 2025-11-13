const pool = require('../config/dataBase');

/* ==========================================================
   💰 OBTENER TODOS LOS MOVIMIENTOS
   ========================================================== */
const getMovimientos = async (req, res) => {
  try {
    const [result] = await pool.query(
      'SELECT * FROM movimientos ORDER BY fecha DESC'
    );
    res.json(result);
  } catch (err) {
    console.error('Error al obtener movimientos:', err);
    res.status(500).json({
      error: 'Error al obtener movimientos',
      detalle: err.message
    });
  }
};

/* ==========================================================
   ➕ AGREGAR NUEVO MOVIMIENTO (Ingreso o Gasto)
   ========================================================== */
const agregarMovimiento = async (req, res) => {
  try {
    const { tipo, descripcion, monto } = req.body;

    if (!tipo || !monto) {
      return res
        .status(400)
        .json({ mensaje: 'Faltan campos obligatorios (tipo o monto)' });
    }

    await pool.query(
      'INSERT INTO movimientos (tipo, descripcion, monto) VALUES (?, ?, ?)',
      [tipo, descripcion, monto]
    );

    res.json({ mensaje: 'Movimiento agregado correctamente' });
  } catch (err) {
    console.error('Error al agregar movimiento:', err);
    res.status(500).json({
      mensaje: 'Error al agregar movimiento',
      detalle: err.message
    });
  }
};

/* ==========================================================
   📊 OBTENER RESUMEN CONTABLE (Ingresos, Gastos y Saldo)
   ========================================================== */
const getResumen = async (req, res) => {
  try {
    const sql = `
      SELECT
        IFNULL(SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END), 0) AS total_ingresos,
        IFNULL(SUM(CASE WHEN tipo = 'gasto' THEN monto ELSE 0 END), 0) AS total_gastos,
        (IFNULL(SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END), 0) -
         IFNULL(SUM(CASE WHEN tipo = 'gasto' THEN monto ELSE 0 END), 0)) AS saldo
      FROM movimientos
    `;

    const [result] = await pool.query(sql);
    res.json(result[0]);
  } catch (err) {
    console.error('Error al obtener resumen:', err);
    res.status(500).json({
      error: 'Error al obtener resumen contable',
      detalle: err.message
    });
  }
};

/* ==========================================================
   🗑 ELIMINAR MOVIMIENTO
   ========================================================== */
const eliminarMovimiento = async (req, res) => {
  try {
    const { id_movimiento } = req.params;

    const [result] = await pool.query(
      'DELETE FROM movimientos WHERE id_movimiento = ?',
      [id_movimiento]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Movimiento no encontrado' });
    }

    res.json({ mensaje: 'Movimiento eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar movimiento:', err);
    res.status(500).json({
      mensaje: 'Error al eliminar movimiento',
      detalle: err.message
    });
  }
};

/* ==========================================================
   🔍 OBTENER MOVIMIENTO POR ID
   ========================================================== */
const getMovimientoPorId = async (req, res) => {
  try {
    const { id_movimiento } = req.params;

    const [result] = await pool.query(
      'SELECT * FROM movimientos WHERE id_movimiento = ?',
      [id_movimiento]
    );

    if (result.length === 0) {
      return res.status(404).json({ mensaje: 'Movimiento no encontrado' });
    }

    res.json(result[0]);
  } catch (err) {
    console.error('Error al obtener movimiento por ID:', err);
    res.status(500).json({
      error: 'Error al obtener movimiento por ID',
      detalle: err.message
    });
  }
};

module.exports = {
  getMovimientos,
  agregarMovimiento,
  getResumen,
  eliminarMovimiento,
  getMovimientoPorId
};
