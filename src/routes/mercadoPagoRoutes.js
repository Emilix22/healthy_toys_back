const express = require('express');
const router = express.Router();

const mercadoPagoController = require('../controllers/mercadoPagoController');

//Crear preferencias
router.post("/create_preference", mercadoPagoController.preferenceCreate);

//Confirmación pago MP
router.post("/web_hook", mercadoPagoController.webHook);


module.exports = router;