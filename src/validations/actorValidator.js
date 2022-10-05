const {check, body} = require('express-validator');

module.exports = [
    check('first_name')
        .notEmpty().withMessage('El nombre es obligatorio').bail()
        .isLength({
            min : 2,
            max: 100
        }).withMessage('Entre 2 y 100 caracteres').bail(),
    
    check('last_name')
        .notEmpty().withMessage('El nombre es obligatorio').bail()
        .isLength({
            min : 2,
            max: 100
        }).withMessage('Entre 2 y 100 caracteres').bail(),

    check('rating')
        .notEmpty().withMessage('El ranking es obligatorio').bail()
        .isNumeric().withMessage("Debe ser un numero decimal"), 
]