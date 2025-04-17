const express= require("express")
const router= express.Router()

const {Cardfetch}=require("../controller/Card/cardfetch")

router.post("/your_recomendation",Cardfetch)
// router.post("/",Cardfetch)

module.exports= router
