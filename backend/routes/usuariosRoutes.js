const Router= require('express')
const router =Router();
const { loginUsuario, registrarUsuario }=require('../controllers/usuariosController')



// Ruta para registrar usuario
router.post("/registrar", registrarUsuario);

// Ruta para iniciar sesión
router.post("/login", loginUsuario);

module.exports= router;
