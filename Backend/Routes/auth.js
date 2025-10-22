const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_Secret="daimaisagood@girl";
const fetchUser=require("../middleware/fetchUser");
//Route:1 Create a User using: POST "/api/auth/". Doesn't require Auth
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 })
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      // Check if the user with the same email already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Sorry, a user with this email already exists" });
      }
  
      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
  
      // Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass, // Save the hashed password
        email: req.body.email,
      });

      const data={
        id:user.id
      }
    const authToken=jwt.sign(data,JWT_Secret);


      res.json({authToken});
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error");
    }
  });
  //Route:2 Create a User using: POST "/api/login/". Doesn't require Auth  
  router.post('/login', [
    
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password can not be blank').exists()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try {
      let user= await User.findOne({email});
      if(!user){
        return res.status(404).json({error:"please!try to logi with correct credentials"})
      }
      const passwordCompare= await bcrypt.compare(password,user.password);
      if(!passwordCompare){
        return res.status(404).json({error:"please!try to logi with correct credentials"})
      }
      const data={
        id:user.id
      }
      const authToken=jwt.sign(data,JWT_Secret);
      res.json({authToken});
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error");
    }
  });
  //Route:2 Fetch a User using: POST "/api/getuser/". require Login 
  router.post('/getuser', fetchUser, async (req, res) => {
    try {
      const userid = req.user.id;  // Corrected variable declaration
      const user = await User.findById(userid).select("-password");  // Fixed case sensitivity issue
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error");
    }
  });
module.exports = router;
