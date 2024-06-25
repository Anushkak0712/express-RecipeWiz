var express = require('express');
var mongoose=require('mongoose');
var router = express.Router();
var recipe=require('../models/recipes')

router.get('/recipe',async(req,res)=>{
    recipe.find().then((recipes)=>{
      res.json({recipes:recipes});
      console.log(recipes);
    })
  })

router.post('/recipe', async(req,res)=> {
    try{
      const newRecipe=new recipe(req.body);
      await newRecipe.save().
      then((savedRecipe)=>{
        console.log(savedRecipe);
        res.status(201).json({msg:"recipe added successfully"})})
     
      }
    catch(error){
      console.log(error);
      res.status(500).json({msg:"recipe could not be saved"})
    }
  });

  module.exports = router;