const express = require('express');
const mongoose=require('mongoose');
const cookieParser = require('cookie-parser')
const router = express.Router();
const user=require('../models/users');
const auth = require('../auth');

/* GET users listing. */

router.post('/register', async(req,res)=> {
  if(req.cookies.jwt) return res.redirect('/profile');
  try{
    const newUser=new user(req.body);
    await newUser.save().
    then((savedUser)=>{
      console.log(savedUser);
      //res.status(201).json({msg:"user added successfully"})})
      var username=req.body.username;
      const payload = {
        username
      };
      const token = auth.generateToken(payload);
      res.cookie('jwt', token,{sameSite: 'None'});
      return res.redirect('http://localhost:3011/profile')
    })
    .catch((error)=>{console.log(error);
      if (error.code===11000 && error.keyPattern && error.keyPattern.email){
        res.status(400).json({msg:"email already in use"})
      }
      else if (error.code===11000 && error.keyPattern && error.keyPattern.username){
        res.status(400).json({msg:"username already in use"})
      }
      else{
        res.status(400).json({msg:"cannot create user"})
      }
    })
    }  
  catch(error){
    console.log(error);
    res.status(500).json({msg:"user could not be saved"})
  }
});

router.get('/user',async(req,res)=>{
  user.find().then((users)=>{
    res.json({users:users});
    console.log(users);
  })
})
router.get('/user/:username',async(req,res)=>{
  const username=req.params.username;
  try {
    console.log(username);
    const userr=await user.find({username:username});
    if (!userr){
      res.status(404).json({msg:'user not found'});
    }
    else{
      console.log(userr);
      const pass = userr[0].password;
      console.log(pass);
      res.status(200).json({password:pass});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:'error fetching user'});
  }
})

//Showing login form
router.get("/login", function (req, res) {
    if(req.cookies.jwt) return res.redirect('/home');
    res.render("login");
});
 
//Handling user login
router.post("/login", async function(req, res){
    try {
        // check if the user exists
        const userr = await user.findOne({ username: req.body.username });
        if (userr) {
          //check if password matches
          const result = req.body.password === userr.password;
          if (result) {
            const payload = {
              username:req.body.username
            };
            const token = auth.generateToken(payload);
            res.cookie('jwt', token);
            res.redirect('/home');
          } else {
            res.status(400).json({ error: "password doesn't match" });
          }
        } else {
          res.status(400).json({ error: "User doesn't exist" });
        }
      } catch (error) {
        res.status(400).json({ error });
      }
});
module.exports = router;
