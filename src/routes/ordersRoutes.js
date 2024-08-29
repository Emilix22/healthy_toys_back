const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')

const orderController = require("../controllers/ordersController");

//Todos las ordenes
router.get("/", orderController.list);
//crear Orden
router.post("/create", authMiddleware, orderController.create);
//Detalle de la orden
router.post('/detail', authMiddleware, orderController.detail);


module.exports = router;