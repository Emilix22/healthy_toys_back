const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerProducts');
const authMiddleware = require('../middlewares/authMiddleware')
const validationImage = require ('../middlewares/validationImage')
// const validationsProduct = require ('../middlewares/validationsProduct')

const productsController = require('../controllers/productsController');

//Todos los productos
router.post("/", authMiddleware,  productsController.list);

//crear producto
router.post('/create',  upload.single('image'), validationImage, /*[validationsProduct],*/ productsController.create);

//editar producto
router.put('/update/:id/', upload.single('image'), validationImage, /*[validationsProduct],*/ productsController.update);

//Eliminar producto
router.delete('/delete/:id/', productsController.destroy);

// //Buscar un producto por DNI
// router.post('/dni', productsController.findDNI)

// // //Listar productos eliminados
// // router.get('/removed', usersApiController.removed);

// // //Recuperar producto eliminado
// // router.post('/restore/:id/', usersApiController.restore);

// // //Perfil de producto
// // router.get('/profile/:id', usersApiController.profile);

// // //Modificar permisos de producto
// // // router.get('/level/:id/', adminMiddleware, productsController.level);
// // router.put('/level/:id/', usersApiController.changeLevel);

module.exports = router;