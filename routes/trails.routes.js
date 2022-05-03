const router = require("express").Router();

const mongoose = require("mongoose");
const axios = require("axios")

//Model
const Routes = require ("../models/Route.model.js");

//****************** Routes ******************
//Create Running route
router.get("/create",(req,res,next)=>{
    res.render("trails/create-route")
})

router.post("/create", (req, res, next) => {
    const {name, private, startLat, startLng, endLat, endLng, distance } = req.body
    console.log(req.body)
    console.log(name, startLat, startLng, endLat, endLng, distance)
    console.log({name, startPoint: [startLat,startLng], endPoint: [endLat, endLng], distance})
    baseUrl = "https://maps.googleapis.com/maps/api/staticmap?markers=color:red%7C"
    optionsStr = "&zoom=15&size=600x400&key=AIzaSyChdc2N7AHjRp9ERUZmD_SJy68ivwF7qEM"
    
    const image = baseUrl + startLat + "," + startLng + "%7C" + endLat + "," + endLng + optionsStr

    console.log("image", image)
    Routes.create({name, startPoint: [startLat,startLng], endPoint: [endLat, endLng], distance, image})
    .then(()=>{ 
        res.redirect("/routes/list")})
    .catch(err=>console.log(err))
    
})

//Running route list page
router.get("/list",(req,res,next)=>{
    res.render("trails/routes")
})

// Running route Details page
router.get("/routes/:id",(req,res,next)=>{

})

//Edit Running route
router.get("/routes/:id/edit",(req,res,next)=>{

})

router.post("/routes/:id/edit",(req,res,next)=>{

})

//Delete running route
router.post("/routes/:id/delete",(req,res,next)=>{

})
 
module.exports = router;