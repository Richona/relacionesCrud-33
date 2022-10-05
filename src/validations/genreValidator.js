const {check, body} = require('express-validator');
const db = require('../database/models');

const rankings = []

db.Genre.findAll()
    .then(genres => {
        genres.forEach(genre => {       
            rankings.push(genre.ranking)
        })       
    })

module.exports = [
    check('name')
        .notEmpty().withMessage('El nombre es obligatorio').bail()
        .isLength({
            min : 2,
            max: 100
        }).withMessage('Entre 2 y 100 caracteres').bail(),

    check('ranking')
        .notEmpty().withMessage('El ranking es obligatorio').bail()
        .isNumeric({
            no_symbols : true,
        }).withMessage('Debe un número entero positivo').bail()
        .custom((value,{req}) =>{
            
            let rankeo = rankings.find(ranking => {
                ranking === +value
            });
            
            return !!!rankeo;
        }).withMessage('El ranking se encuentra ocupado'),

    check('active')
        .notEmpty().withMessage('El estado es obligatorio').bail(),   
]