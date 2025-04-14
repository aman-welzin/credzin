const bcrypt=require("bcrypt");
const User = require("../models/User")
const jwt= require("jsonwebtoken")
const Cards = require("../models/card")
require("dotenv").config()
const mongoose = require("mongoose");

exports.signup = async (req, res) => {
    const { firstName, lastName, email, password, contact } = req.body;
    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: "User already exists" });
  
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ firstName, lastName, email, password: hashed, contact });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      user.token = token;
      await user.save();
  
      res.status(201).json({ user, token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // Form Login
  exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || !user.password) return res.status(400).json({ message: "Invalid credentials" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      user.token = token;
      await user.save();
     console.log(user)
      res.status(200).json({ user, token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  exports.googleLoginSuccess = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Google login failed" });
  
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    req.user.token = token;
    await req.user.save();
  
    res.redirect(`${process.env.CLIENT_URL}/home?token=${token}`);
  };


exports.getUserData = async (req, res) => {
    try {
        if (!req.id) {
            return res.status(400).json({
              success: false,
              message: 'User ID missing in request.',
            });
          }
  
          const userId = req.id;
  
      const user = await User.findById(userId).select('-password'); // Exclude password from response
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
        });
      }
      // console.log("this is card added",user.CardAdded);
      // Send the user data in the response.
      res.status(200).json({
        success: true,
        user: user,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
        error: error.message,
      });
    }
  };
  exports.addcards=async(req, res)=>{
    try{
      // console.log("YOUR CARD ID", req.id)
        const userId = req.id; // User ID from verifyToken middleware
        const productIds = req.body.productIds; 
        console.log(` this is card id ${productIds}`)

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID missing.' });
    }
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Product IDs array missing or empty.' });
    }

    // Validate product IDs

    const invalidIds = productIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({ success: false, message: 'Invalid product IDs.', invalidIds });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Find the products
    const products = await Cards.find({ _id: { $in: productIds } });
    // console.log("this is the products",products)
    if (products.length !== productIds.length) {
      const foundIds = products.map(p => p._id.toString());
      const missingIds = productIds.filter(id => !foundIds.includes(id));
      return res.status(404).json({ success: false, message: 'One or more products not found.', missingIds });
    }

    // Add products to the user's cart
    products.forEach(product => {
      if (!user.CardAdded.includes(product._id)) {
          user.CardAdded.push(product._id);
      }
  });
    // console.log("we are here in add cards")

    // console.log(user.CardAdded)

    await user.save();

    res.status(200).json({ success: true, message: 'Products added to cart.', cart: user.cart });

    }
    catch(error){
        console.error('Error adding to user cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });

    }
  }
  exports.getUserCards = async (req, res) => {
    try {
      console.log("inside the user card ")
        const userId = req.id; // Extract user ID from request

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        // Fetch user and populate the CardAdded field
        const user = await User.findById(userId)
    .populate({
        path: "CardAdded", // Populate the CardAdded array
        select: "bank_name features joining_fee annual_fee know_more_link apply_now_link image_url rewards card_name", // Select all required fields
    })
    .select("-password"); // Exclude password from response

    console.log(user); 

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        console.log(user);

        // Send the populated cards
        res.status(200).json({
            success: true,
            cards: user.CardAdded, // Populated cards
        });

    } catch (error) {
        console.error("Error fetching user cards:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};



exports.removeCardFromCart = async (req, res) => {
    try {
        const userId = req.id
        const { cardId } = req.body; // Extract userId and cardId from request body

        if (!userId || !cardId) {
            return res.status(400).json({ success: false, message: "User ID and Card ID are required." });
        }

        // Find the user and remove the card from the CardAdded array
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { CardAdded: cardId } }, // Remove the cardId from CardAdded array
            { new: true } // Return the updated document
        ).populate({
            path: "CardAdded",
            model: "Cards",
            select: "bank_name features joining_fee annual_fee image_URL card_name", // Select required fields
        });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        console.log("this is updated user",updatedUser)

        return res.status(200).json({ success: true, message: "Card removed successfully.", user: updatedUser });

    } catch (error) {
        console.error("Error removing card:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};
