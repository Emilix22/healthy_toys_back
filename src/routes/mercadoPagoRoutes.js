const express = require('express');
const router = express.Router();

const mercadoPagoController = require('../controllers/mercadoPagoController');

//Crear preferencias
router.post("/create_preference", mercadoPagoController.preferenceCreate);


module.exports = router;