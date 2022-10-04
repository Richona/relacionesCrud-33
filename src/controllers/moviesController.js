const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const { redirect } = require('express/lib/response');
const { resolveSoa } = require('dns');
const moment = require("moment")

const { validationResult } = require('express-validator');

//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', { movies })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id, {
            include: [{ association: "genero" }, { association: "actores" }]
        })
            .then(movie => {
                res.render('moviesDetail.ejs', { movie });
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', { movies });
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        Genres.findAll({ order: ["name"] })
            .then(allGenres => res.render("moviesAdd", { allGenres }))
            .catch(error => console.log(error))
    },
    create: function (req, res) {
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            const { title, rating, awards, release_date, length, genre_id } = req.body
            Movies.create({
                title,
                rating,
                awards,
                release_date,
                genre_id,
                length
            })
                .then(res.redirect("/movies"))
                .catch(error => console.log(error))
        } else {
            Genres.findAll({ order: ["name"] })
                .then(allGenres => res.render("moviesAdd", { allGenres, errors: errors.mapped(), old: req.body }))
                .catch(error => console.log(error))
        }
    },
    edit: function (req, res) {
        const movieToedit = Movies.findByPk(req.params.id)

        const generos = Genres.findAll({ order: ["name"] })

        Promise.all([movieToedit, generos])
            .then(([Movie, allGenres]) => res.render("moviesEdit", { Movie, allGenres, moment }))
            .catch(error => console.log(error))
    },
    update: function (req, res) {
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            const { title, rating, awards, release_date, length, genre_id } = req.body
            Movies.update({
                title,
                rating,
                awards,
                release_date,
                genre_id,
                length
            }, {
                where: {
                    id: req.params.id
                }
            })
                .then(res.redirect("/movies/detail/ " + req.params.id))
                .catch(error => console.log(error))
        }else {
            const movieToedit = Movies.findByPk(req.params.id)

            const generos = Genres.findAll({ order: ["name"] })

            Promise.all([movieToedit, generos])
                .then(([Movie, allGenres]) => res.render("moviesEdit", { Movie, allGenres, moment, errors: errors.mapped(), old: req.body}))
                .catch(error => console.log(error))
        }
    },
    delete: function (req, res) {
        Movies.findByPk(req.params.id)
            .then(Movie => res.render("moviesDelete", { Movie }))
            .catch(error => console.log(error))
    },
    destroy: function (req, res) {
        Movies.destroy({
            where: { id: req.params.id }
        })
            .then(res.redirect("/movies"))
            .catch(error => console.log(error))
    }
}

module.exports = moviesController;