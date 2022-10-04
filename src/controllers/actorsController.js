const db = require("../database/models")

module.exports = {
    list : (req,res) => {
        db.Actor.findAll()
            .then(actors => res.render("actorsList", {actors}))
            .catch(error => console.log(error))
    },
    detail : (req,res) => {
        db.Actor.findByPk(req.params.id, {
            include:[{association: "peliculas"}]
        })
            .then(actor => { 
                
                res.render("actorsDetail", {actor})
            })
            .catch(error => console.log(error))
    },
    add: function (req, res) {
        db.Movie.findAll()
            .then(movie => {
                return res.render("actorsAdd", {movie})
            })
    },
    create: function (req,res) {
        db.Actor.create({
            ...req.body
        })
            .then(res.redirect("/actors"))
            .catch(error => console.log(error))
    },
    edit: function(req,res) {
        db.Genre.findByPk(req.params.id)
            .then(genre => res.render("genresEdit", {genre}))
            .catch(error => console.log(error))         
    },
    update: function (req,res) {
        db.Genre.update({
           ...req.body
        }, {
            where: {
                id: req.params.id
            }
        })
            .then(res.redirect("/genres/detail/ "+req.params.id))
            .catch(error => console.log(error))
    },
    delete: function (req,res) {
        db.Genre.findByPk(req.params.id)
            .then(genre => res.render("genresDelete",{genre}))
            .catch(error => console.log(error))
    },
    destroy: function (req,res) {
        db.Genre.destroy({
            where: {id: req.params.id}
        })
            .then(res.redirect("/genres"))
            .catch(error => console.log(error))
    }

}