// const mongoose = require("mongoose");

// const cardSchema= new mongoose.Schema(
//     {
//         bank_name:{
//             type:String,
//             required:true,
//         },
//         features:{
//             type:String,
//             required:true,
//         },
//         joining_fee:{
//             type:String,
//             required:true,
//             trim:true,
//         },
//         annual_fee:{
//             type:String,
//             required:true,
//             trim:true,
//         },
//         know_more_link:{
//             type:String,
//             required:true,
//             trim:true,
//         },
//         apply_now_link:{
//             type:String,
//             required:true,
//             trim:true,
//         },
//         image_url:{
//             type:String,
//             required:true,
//             trim:true,
//         },
//         rewards:{
//             type:String,
//             required:true,
//             trim:true,
//         },
//         card_name:{
//             type:String,
//             required:true,
//         }
        
        
//     }
// )

// module.exports = mongoose.model("Cards", cardSchema);

const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
    {
        bank_name: {
            type: String,
            required: true,
        },
        card_name: {
            type: String,
            required: true,
        },
        features: {
            type: String,
            required: true,
        },
        joining_fee: {
            type: String,
            required: true,
            trim: true,
        },
        annual_fee: {
            type: String,
            required: true,
            trim: true,
        },
        know_more_link: {
            type: String,
            required: true,
            trim: true,
        },
        apply_now_link: {
            type: String,
            required: true,
            trim: true,
        },
        image_url: {
            type: String,
            required: true,
            trim: true,
        },
        rewards: {
            type: String,
            required: true,
            trim: true,
        },
        // Additional fields from credit_cards collection
        annual_fee_waiver: String,
        add_on_card_fee: String,
        interest_rate_pa: String,
        card_type: String,
        card_category: [String],
        card_usp: String,
        movie_offer: Boolean,
        fuel_offer: String,
        culinary_treats: String,
        airport_lounge_access: String,
        reward_points: Boolean,
        returns_rate: String,
        features_clean: String,
        welcome_benefit: Boolean,
        milestone_benefit: Boolean,
        lounge_access: Boolean,
        fuel_benefit: Boolean,
        dining_offer: Boolean,
        travel_offer: Boolean,
        international_use: Boolean,
        insurance: Boolean,
        welcome_points: Boolean,
        milestone_rewards: Boolean,
        bonus_points: Boolean,
        cashback_offer: Boolean,
        voucher_offer: Boolean,
        travel_rewards: Boolean,
        fuel_rewards: Boolean,
        movie_rewards: Boolean
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cards", cardSchema);