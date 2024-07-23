const { body } = require('express-validator');


const validationsRegister = [

    body('name').notEmpty().withMessage('El campo "Nombre" es obligatorio')
     .isLength({min: 2}).withMessage('El campo "Nombre" debe tener como mínimo 2 caracteres'),
    
    body('surname').notEmpty().withMessage('El campo "Apellido" es obligatorio')
     .isLength({min: 2}).withMessage('El campo "Apellido" debe tener como mínimo 2 caracteres'),

    body('dni').notEmpty().withMessage('El campo "DNI" es obligatorio')
     .isNumeric().withMessage('El campo "DNI" sólo puede contener números')
     .isLength({min: 8, max: 8}).withMessage("El DNI debe tener 8 caracteres"),

    body('email').notEmpty().withMessage('El campo "Email" es obligatorio')
     .isEmail().withMessage('El email no es válido'),

    body('password').notEmpty().withMessage('El campo "Password" es obligatorio')
    .isLength({min: 8, max: 15}).withMessage("El password debe tener entre 8 y 15 caracteres")
    .matches(/^(.*[a-z].*)$/).withMessage("El password debe tener mínimo una minúscula")
    .matches(/^(.*[A-Z].*)$/).withMessage("El password debe tener mínimo una mayúscula")
    .matches(/^(.*[0-9].*)$/).withMessage("El password debe tener mínimo un número")
]

module.exports = validationsRegister;