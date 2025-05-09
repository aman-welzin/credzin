const Card = require("../../models/card")
exports.Cardfetch=async(req,res)=>{
    try{
        console.log(req.body)
        const bank_name=req.body.bank_name
        // console.log(bank_name)
        if(!bank_name){
            return res.status(404).json({
                success:false,
                message:"bank name not found"
            })
        }
       
        const card =  await Card.find({bank_name:bank_name})
        if(!card){
            return res.status(400).json({
                success:false,
                message:`No card found`
            })
        };
        return res.status(200).json({
            success:true,
            message:`All card for ${bank_name} `,
            cards:card
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:`error in fetching card details`,
            error:error.message
        })

    }
}