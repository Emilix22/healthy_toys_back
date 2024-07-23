const { body } = require('express-validator');

const validationsLogin = [

    body('email').notEmpty().withMessage('El campo "Email" es obligatorio'),

    body('password').notEmpty().withMessage('El campo "Password" es obligatorio')

]

module.exports = validationsLogin;
