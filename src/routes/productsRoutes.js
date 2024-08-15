const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerProducts');
const authMiddleware = require('../middlewares/authMiddleware')
const validationImage = require ('../middlewares/validationImage')
// const validationsProduct = require ('../middlewares/validationsProduct')

const productsController = require('../controllers/productsController');

//Todos los productos
router.get("/", productsController.list);

//crear producto
router.post('/create', authMiddleware, upload.fields([{name: 'image1'}, {name: 'image2'}, {name: 'image3'}, {name: 'image4'}]),/*upload.single('image'),*/ validationImage, /*[validationsProduct],*/ productsController.create);

//editar producto
router.put('/update/:id/', upload.single('image'), validationImage, /*[validationsProduct],*/ productsController.update);

//Eliminar producto
router.delete('/delete/:id/', productsController.destroy);

//Detalle de producto
router.get('/detail/:id', productsController.detail);

// //Buscar un producto por DNI
// router.post('/dni', productsController.findDNI)

// // //Listar productos eliminados
// // router.get('/removed', usersApiController.removed);

// // //Recuperar producto eliminado
// // router.post('/restore/:id/', usersApiController.restore);


// // //Modificar permisos de producto
// // // router.get('/level/:id/', adminMiddleware, productsController.level);
// // router.put('/level/:id/', usersApiController.changeLevel);

module.exports = router;