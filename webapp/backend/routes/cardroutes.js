const express= require("express")
const router= express.Router()

const {Cardfetch}=require("../controller/Card/cardfetch")
const{all_bank} = require("../controller/Card/cardfetch")
router.post("/your_recomendation",Cardfetch)

router.get("/all_bank",all_bank)
// router.post("/",Cardfetch)

module.exports= router
