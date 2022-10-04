const db = require('../database/models');
const sequelize = db.sequelize;


const genresController = {
    'list': (req, res) => {
        db.Genre.findAll()
            .then(genres => {
                res.render('genresList.ejs', {genres})
            })
    },
    'detail': (req, res) => {
        db.Genre.findByPk(req.params.id,{
            include:[{association: "peliculas"}]
        })
            .then(genre => {
                res.render('genresDetail.ejs', {genre});
            });
    },
    add: function (req, res) {
        return res.render("genresAdd")
    },
    create: function (req,res) {
        db.Genre.create({
            ...req.body
        })
            .then(res.redirect("/genres"))
            .catch(error => console.log(error))
    },
    edit: function(req,res) {
        const movieToedit = Movies.findByPk(req.params.id)

        const generos = Genres.findAll({order: ["name"]})

        Promise.all([movieToedit,generos])
            .then(([Movie, allGenres]) => res.render("moviesEdit", {Movie,allGenres, moment}))
            .catch(error => console.log(error))
    },
    update: function (req,res) {
        const {title, rating, awards, release_date, length, genre_id} = req.body
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
            .then(res.redirect("/movies/detail/ "+req.params.id))
            .catch(error => console.log(error))
    },
    delete: function (req,res) {
        Movies.findByPk(req.params.id)
            .then(Movie => res.render("moviesDelete",{Movie}))
            .catch(error => console.log(error))
    },
    destroy: function (req,res) {
        Movies.destroy({
            where: {id: req.params.id}
        })
            .then(res.redirect("/movies"))
            .catch(error => console.log(error))
    }

}

module.exports = genresController;