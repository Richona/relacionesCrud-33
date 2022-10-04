const {check, body} = require('express-validator');


module.exports = [
    check('title')
        .notEmpty().withMessage('El titulo es obligatorio').bail()
        .isLength({
            min : 2,
            max: 500
        }).withMessage('Entre 2 y 500 caracteres').bail(),

    check('rating')
        .notEmpty().withMessage('El rating es obligatorio').bail()
        .isNumeric().withMessage("Debe ser un numero decimal"),

    check('awards')
        .notEmpty().withMessage('El awards es obligatorio').bail()
        .isNumeric({
        no_symbols : true,
        }).withMessage('Debe un número entero positivo'),

    check('release_date')
        .notEmpty().withMessage('La fecha es obligatoria').bail()
        .isDate().withMessage('Debe ser una fecha valida'),

    body('length')
        .isNumeric({
            no_symbols : true,
        }).withMessage('Debe un número entero positivo').bail(),   
]