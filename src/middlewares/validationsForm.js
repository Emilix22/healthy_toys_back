const { body } = require('express-validator');

const validationsForm = [

    body('name').notEmpty().withMessage('El campo "Nombre" es obligatorio')
     .isLength({min: 2}).withMessage('El campo "Nombre" debe tener como mínimo 2 caracteres'),

    body('surname').notEmpty().withMessage('El campo "Apellido" es obligatorio')
     .isLength({min: 2}).withMessage('El campo "Apellido" debe tener como mínimo 2 caracteres'),

    body('email').notEmpty().withMessage('El campo "Email" es obligatorio')
     .isEmail().withMessage('Formato de email inválido'),

    body('phone').notEmpty().withMessage('El campo "Teléfono" es obligatorio'),

    body('origin').notEmpty().withMessage('El campo "Origen" es obligatorio'),
    
    body('date').notEmpty().withMessage('El campo "Fecha" es obligatorio'),
    // .isDate().withMessage('El campo "Fecha" debe tener el siguiente formato (AAAA-MM-dd)'),

    body('amount').notEmpty().withMessage('El campo "Monto" es obligatorio')
     .isNumeric().withMessage('El campo "Monto" sólo puede contener números'),

    body('web').notEmpty().withMessage('El campo "Web" es obligatorio')
     .isLength({min: 2}).withMessage('El campo "Web" debe tener como mínimo 2 caracteres'),

]

module.exports = validationsForm;