const express = require("express");
const User = require("../models/user");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser')

 const JWT_SECRET = 'anuisasmartassboy';
// Route1: Creating a user using Endpoint "/api/auth/createuser".

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password").isLength({ min: 5 }),
    body("email", "Enter a valid name").isEmail(),
  ],
  async (req, res) => {
    let success = false;
    // if there are errors then return array of errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return res.status(400).json({success, errors: errors.array() });
    }
    try {
      // Check if the user if this emial exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success, error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password,salt)
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
          user:{
              id: user.id
          }
      }
      const authtoken = jwt.sign(data,JWT_SECRET);
      success = true;
      res.json({success,authtoken});

    }
     catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

// Route2: Creating a Endpoint for user authentication "/api/auth/login".

router.post(
    "/login",
    [
      body("email").isEmail(),
      body("password",'Password can not be blank').exists()
    ],
    async (req, res) => {
      let success = false;
        const {email,password} = req.body;
        try {
          let user = await User.findOne({email});
          if(!user){
              success = false;
              return res.status(400).json({error:"Please try to login with correct credentials"})
            }
            const passCompare = await bcrypt.compare(password,user.password);
            if(!passCompare){
                success = false;
                return res.status(400).json({error:"Please try to login with correct credentials"})
            }
            const data = {
                user:{
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data,JWT_SECRET);
            res.json({success:true , authtoken});

        } catch (error) {
           console.log(error.message);
           res.send('Internal Server error')
        }
        
    })

    // Route3: Get logged in user details using POST "/api/auth/getuser" .Logged in required
    router.post(
        "/getuser",fetchUser,
        async (req, res) => {
            try{
                const userId = req.user.id;
                const user = await User.findById(userId).select("-password")
                res.send(user)
            }
            catch(error){ 
                console.log(error.message);
                res.send('Internal Server error')
            }
        })

  

module.exports = router;
