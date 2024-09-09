const express = require('express');
const router = express.Router();

const mercadoPagoController = require('../controllers/mercadoPagoController');

//Crear preferencias
router.post("/create_preference", mercadoPagoController.preferenceCreate);

//Crear preferencias
router.post("/web_hook", mercadoPagoController.webHook);


module.exports = router;