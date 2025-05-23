const express= require("express")
const router= express.Router()

const {verifyToken} = require("../middlewares/verifyToken")

const {Cardfetch, recommended_card}=require("../controller/Card/cardfetch")
const{all_bank} = require("../controller/Card/cardfetch")
router.post("/your_recomendation",Cardfetch)

router.get("/all_bank",all_bank)
router.get("/recommendedcard",verifyToken,recommended_card)
// router.post("/",Cardfetch)

module.exports= router
