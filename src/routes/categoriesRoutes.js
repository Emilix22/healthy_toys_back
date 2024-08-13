const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')

const categoriesController = require("../controllers/categoriesController");

//Todos los permisos de usuario
router.get("/", categoriesController.list);

//crear permiso de usuario
router.post("/create", authMiddleware, categoriesController.create);

//editar permiso de usuario
router.put("/update/:id/", authMiddleware, categoriesController.update);

//Eliminar permiso de usuario
router.delete("/delete/:id/", authMiddleware, categoriesController.destroy);

//Listar permisos de usuario eliminados
// router.get('/removed', usersApiController.removed);

//Recuperar permisos de usuario eliminado
// router.post('/restore/:id/', usersApiController.restore);

module.exports = router;