const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
//const upload = require('../middlewares/multerUsers');
//const validationImage = require ('../middlewares/validationImage')

const privilegesController = require("../controllers/privilegesController");

//Todos los permisos de usuario
router.post("/", authMiddleware, privilegesController.list);

//Buscar un permiso de usuario
router.post("/search", authMiddleware, privilegesController.search);

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

//Perfil de permiso de usuario  (lo hago en el front en este caso)
// router.get('/profile/:id', usersApiController.profile);

module.exports = router;