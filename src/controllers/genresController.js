const db = require('../database/models');
const sequelize = db.sequelize;

const { validationResult } = require('express-validator');

const genresController = {
    'list': (req, res) => {
        db.Genre.findAll()
            .then(genres => {
                res.render('genresList.ejs', { genres })
            })
    },
    'detail': (req, res) => {
        db.Genre.findByPk(req.params.id, {
            include: [{ association: "peliculas" }]
        })
            .then(genre => {
                res.render('genresDetail.ejs', { genre });
            });
    },
    add: function (req, res) {
        return res.render("genresAdd")
    },
    create: function (req, res) {
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            db.Genre.create({
                ...req.body
            })
                .then(res.redirect("/genres"))
                .catch(error => console.log(error))
        } else {
            return res.render("genresAdd", {
                errors: errors.mapped(),
                old: req.body
            })
        }
    },
    edit: function (req, res) {
        db.Genre.findByPk(req.params.id)
            .then(genre => res.render("genresEdit", { genre }))
            .catch(error => console.log(error))
    },
    update: function (req, res) {
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            db.Genre.update({
                ...req.body
            }, {
                where: {
                    id: req.params.id
                }
            })
                .then(res.redirect("/genres/detail/ " + req.params.id))
                .catch(error => console.log(error))
        }else {
            db.Genre.findByPk(req.params.id)
                .then(genre => res.render("genresEdit", { genre, errors: errors.mapped(), old: req.body}))
                .catch(error => console.log(error))
        }
    },
    delete: function (req, res) {
        db.Genre.findByPk(req.params.id)
            .then(genre => res.render("genresDelete", { genre }))
            .catch(error => console.log(error))
    },
    destroy: function (req, res) {
        db.Genre.destroy({
            where: { id: req.params.id }
        })
            .then(res.redirect("/genres"))
            .catch(error => console.log(error))
    }

}

module.exports = genresController;