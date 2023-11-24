const express = require('express').Router;
const cors = require("cors");
const router = express();
const User = require("../model/user");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const session = require('express-session');
router.use(cors());



const makeJWT = {
    //Generate Access Token
    generateAccessToken: (user) => {
        return jwt.sign(
          {
            id: user.id,
            isadmin: user.isAdmin
          },
          process.env.JWT_ACCESS_KEY,
          { expiresIn: "2h" }
        );
      },

    // Generate Refresh Token
      generateRefreshToken: (user) => {
        return jwt.sign(
          {
            id: user.id,
            isadmin: user.isAdmin
          },
          process.env.JWT_REFRESH_KEY,
          { expiresIn: "365d" }
        );
      }}
let refreshTokens = [];
//routers
router.post('/login',async(req,res) =>{
    try {
        const user = await User.findOne({username: req.body.username});
        if(!user){
            return res.status(404).json('Wrong username');
        }
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
      );
        if(!validPassword){
            return res.status(404).json('Wrong password');
        }
        if( user && validPassword){
            const accessToken = makeJWT.generateAccessToken(user);
            const refreshToken = makeJWT.generateRefreshToken(user);
            refreshTokens.push(refreshToken);
            res.cookie("refreshToken",refreshToken,{
                httpOnly:true,
                secure:false,
                path:"/",
                sameSite:"strict",
            })
        const { password, ...other} = user._doc;
        res.status(200).json({...other, accessToken});

        //res.status(200).json(user);
        }
    } catch (error) {
      console.log(error);
        res.status(500).json({message: error.message});
    }
});


router.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));


router.delete('/logout',async(req,res) =>{
    req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return res.status(500).json('Something went wrong. Please try again later.');
        }
        res.clearCookie('refreshToken'); // clear session cookie
        res.status(200).json('Logged out successfully.');
      });
})


module.exports = router;