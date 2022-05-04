const router = require("express").Router();

const mongoose = require("mongoose");
const axios = require("axios")

//Model
const Routes = require("../models/Route.model.js");
const User = require("../models/User.model.js");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isCreator = require("../middleware/isCreator")

//****************** Routes ******************
//Create Running route
router.get("/create", isLoggedIn, (req, res, next) => {
    res.render("trails/create-route")
})

router.post("/create", isLoggedIn, (req, res, next) => {
    const { name, private, startLat, startLng, endLat, endLng, distance } = req.body
    

    baseUrl = "https://maps.googleapis.com/maps/api/staticmap?markers=color:red%7C"
    optionsStr = "&zoom=15&size=600x400&key=AIzaSyChdc2N7AHjRp9ERUZmD_SJy68ivwF7qEM"

    const image = baseUrl + startLat + "," + startLng + "%7C" + endLat + "," + endLng + optionsStr

    Routes.create({ name, startPoint: [startLat, startLng], endPoint: [endLat, endLng], distance, image, creator: req.session.user })
        .then((elem) => {
            const idUser = req.session.user._id
            console.log(req.session.user.routesCreated)
            const userRoutes = req.session.user.routesCreated
            userRoutes.push(elem._id.toJSON())
            console.log("userRoutes: ", userRoutes)
            User.findByIdAndUpdate(idUser,{routesCreated: userRoutes},{new: true})
            .then(()=>{
                res.redirect("/routes/list")
            })
            .catch(err => console.log(err))            
        })
        .catch(err => console.log(err))

})

//Running route list page
router.get("/list", isLoggedIn, (req, res, next) => {
    Routes.find()
        .populate("creator")
        .then(route => {

            res.render("trails/routes", { route })
        })

        .catch(err => console.log(err))

})

//Personal User Running routes list page
router.get("/fromuser", isLoggedIn, (req, res, next) => {
    Routes.find({creator: req.session.user})
        .populate("creator")
        .then(route => {

            res.render("trails/user-routes", { route })
        })

        .catch(err => console.log(err))

})

// Running route Details page
router.get("/:id", isLoggedIn, (req, res, next) => {
    const { id } = req.params
    Routes.findById(id)
        .populate("creator")
        .then(elem => {
            console.log(elem)
            res.render("trails/details", { elem })})
        .catch(err => console.log(err))
})

//Edit Running route
router.get("/:id/edit", isLoggedIn, isCreator, (req, res, next) => {
    const { id } = req.params
    Routes.findById(id)
        .then(elem => res.render("trails/edit-route", { elem }))
        .catch(err => console.log(err))
})

router.post("/:id/edit", isLoggedIn, (req, res, next) => {
    const { id } = req.params
    console.log("id:",req.params)
    const { name, private, startLat, startLng, endLat, endLng, distance } = req.body

    baseUrl = "https://maps.googleapis.com/maps/api/staticmap?markers=color:red%7C"
    optionsStr = "&zoom=12&size=600x400&key=AIzaSyChdc2N7AHjRp9ERUZmD_SJy68ivwF7qEM"

    const image = baseUrl + startLat + "," + startLng + "%7C" + endLat + "," + endLng + optionsStr
    Routes.findByIdAndUpdate(id, { name, startPoint: [startLat, startLng], endPoint: [endLat, endLng], distance, image }, { new: true })
        .then(() => {
            res.redirect("/routes/list")
        })
        .catch(err => console.log(err))
})

//Delete running route
router.post("/:id/delete", isLoggedIn, isCreator, (req, res, next) => {
    const { id } = req.params
    Routes.findByIdAndDelete(id)
        .then(() => {
            res.redirect("/routes/list")
        })
        .catch(err => console.log(err))
})

module.exports = router;