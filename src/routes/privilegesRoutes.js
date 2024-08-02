const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')

const privilegesController = require("../controllers/privilegesController");

//Todos los permisos de usuario
router.post("/", authMiddleware, privilegesController.list);

//crear permiso de usuario
router.post("/create", authMiddleware, privilegesController.create);

//editar permiso de usuario
router.put("/update/:id/", authMiddleware, privilegesController.update);

//Eliminar permiso de usuario
router.delete("/delete/:id/", authMiddleware, privilegesController.destroy);

//Listar permisos de usuario eliminados
// router.get('/removed', usersApiController.removed);

//Recuperar permisos de usuario eliminado
// router.post('/restore/:id/', usersApiController.restore);

module.exports = router;