const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerUsers');
const authMiddleware = require('../middlewares/authMiddleware')
const validationsLogin = require('../middlewares/validationsLogin');
const validationsRegister = require('../middlewares/validationsRegister')
const validationImage = require ('../middlewares/validationImage')

const usersController = require('../controllers/usersController');

//Todos los usuarios
router.post("/", authMiddleware,  usersController.list);

//crear usuario
router.post('/create',  upload.single('avatar'), validationImage, [validationsRegister], usersController.create);

//login de usuario
router.post('/login',[validationsLogin], usersController.login);

//Buscar datos usuario logueado
router.post('/dataLoged', authMiddleware, usersController.getUserData)

//editar usuario
//router.put('/update/:id/', upload.single('avatar'), validationImage, [validationsRegister], usersController.update);

//Eliminar usuario
//router.delete('/delete/:id/', usersController.destroy);

// //Buscar un usuario por DNI
// router.post('/dni', usersController.findDNI)

// // //Listar usuarios eliminados
// // router.get('/removed', usersApiController.removed);

// // //Recuperar usuario eliminado
// // router.post('/restore/:id/', usersApiController.restore);

// // //Perfil de usuario
// // router.get('/profile/:id', usersApiController.profile);

// // //Modificar permisos de usuario
// // // router.get('/level/:id/', adminMiddleware, usersController.level);
// // router.put('/level/:id/', usersApiController.changeLevel);

//Cerrar sesión
//router.get('/logout', usuariosApiController.logout);

module.exports = router;