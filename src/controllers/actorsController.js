const db = require("../database/models")

const { validationResult } = require('express-validator');

module.exports = {
    list: (req, res) => {
        db.Actor.findAll()
            .then(actors => res.render("actorsList", { actors }))
            .catch(error => console.log(error))
    },
    detail: (req, res) => {
        db.Actor.findByPk(req.params.id, {
            include: [{ association: "peliculas" }]
        })
            .then(actor => {

                res.render("actorsDetail", { actor })
            })
            .catch(error => console.log(error))
    },
    add: function (req, res) {
        db.Movie.findAll({ order: ["title"] })
            .then(movie => {
                return res.render("actorsAdd", { movie })
            })
    },
    create: function (req, res) {
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            db.Actor.create({
                ...req.body
            })
                .then(res.redirect("/actors"))
                .catch(error => console.log(error))
        } else {
            db.Movie.findAll({ order: ["title"] })
                .then(movie => {
                    return res.render("actorsAdd", { movie, errors: errors.mapped(), old: req.body })
                })
        }
    },
    edit: function (req, res) {
        const movie = db.Movie.findAll({ order: ["title"] });

        const actor = db.Actor.findByPk(req.params.id);

        Promise.all([movie, actor])
            .then(([movie, actor]) => res.render("actorsEdit", { movie, actor }))
            .catch(error => console.log(error))
    },
    update: function (req, res) {
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            db.Actor.update({
                ...req.body
            }, {
                where: {
                    id: req.params.id
                }
            })
                .then(res.redirect("/actors/detail/ " + req.params.id))
                .catch(error => console.log(error))
        }else {
            const movie = db.Movie.findAll({ order: ["title"] });

            const actor = db.Actor.findByPk(req.params.id);

            Promise.all([movie, actor])
                .then(([movie, actor]) => res.render("actorsEdit", { movie, actor, errors: errors.mapped(), old: req.body }))
                .catch(error => console.log(error))
        }
    },
    delete: function (req, res) {
        db.Actor.findByPk(req.params.id)
            .then(actor => res.render("actorsDelete", { actor }))
            .catch(error => console.log(error))
    },
    destroy: function (req, res) {
        db.Actor.destroy({
            where: { id: req.params.id }
        })
            .then(res.redirect("/actors"))
            .catch(error => console.log(error))
    }

}