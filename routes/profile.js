var express = require('express');
var router = express.Router();
var auth=require('../auth');
const multer=require('multer')
const fs = require('fs');
const path=require('path')
const recipe=require('../models/recipes');

// Set up storage engine for multer
const storage_new = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads');
  },
  filename: function (req, file, cb) {
    // Temporarily save the file with a generic name; we'll rename it after getting the recipe ID
    cb(null, `temp_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const storage_existing = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads');
  },
  filename: function (req, file, cb) {
    // Temporarily save the file with a generic name; we'll rename it after getting the recipe ID
    cb(null, `recipe${req.body.id}.jpg`);
  }
});
const upload_new = multer({ storage: storage_new });
const upload_existing = multer({ storage: storage_existing });

router.get('/',auth.isLoggedIn,async(req,res)=>{
    const username = req.user.username; // Assuming the JWT token contains a `username` field
    try {
      const recipes = await recipe.find({ username: username });
      res.render('profile', { username, recipes });
    } catch (err) {
        console.log(err)
      res.status(500).send('Server Error');
    }
  })

router.get('/addrecipe',function(req,res){
    res.render('addrecipe');

})

router.post('/addrecipe',upload_new.single('image'),auth.isLoggedIn, async(req,res)=> {
  console.log(req.body);
  const { title, description, cuisine, ingredients, details, timeRequired } = req.body;
  try {
    const username=req.user.username;
    // First, create the new recipe without the image
    const newRecipe = new recipe({
      title,
      username,
      description,
      cuisine,
      ingredients: ingredients.split(','), // Assuming ingredients are provided as a comma-separated string
      details,
      timeRequired,
      image: null ,
      sharedAt:new Date()// Placeholder for the image path
    });

    // Save the recipe to get the ID
    const savedRecipe = await newRecipe.save();

    // If an image was uploaded, rename the file with the new recipe ID and update the recipe
    if (req.file) {
      console.log('file going for rename')
      const ext = path.extname(req.file.originalname);
      const newImagePath = `public/images/uploads/recipe${savedRecipe._id}${ext}`;
      fs.renameSync(req.file.path, newImagePath);

      // Update the image field of the recipe
      savedRecipe.image = newImagePath.slice(6);
      await savedRecipe.save();
    }
    
        return res.redirect('/home/profile');
      }
    catch(error){
      console.log(error);
      res.status(500).json({msg:"recipe could not be saved"})
    }
  });
// Route to render the update form with populated data
router.get('/updaterecipe', (req, res) => {
    const { id, title, description, ingredients, details, cuisine, image } = req.query;
    console.log("ingredients:",ingredients);
    res.render('updaterecipe', { id, title, description,cuisine, ingredients, details,  image });
});

router.post('/updaterecipe',upload_existing.single('image'),async (req,res)=>{
    try{
    console.log("hit post")
    req.body.ingredients=req.body.ingredients.split(',')
    const{id, title, description, ingredients, details, cuisine}=req.body;
    var result= await recipe.updateOne({_id:req.body.id},{$set:{id, title, description, ingredients, details, cuisine,image:`/images/uploads/${req.file.filename}`}});
    console.log(result);
    res.redirect("/home/profile")
    }
    catch(error){
        console.log(error)
    }
})

router.post('/deleterecipe', (req, res) => {
    try {
        const { id } = req.body;
        recipe.findByIdAndDelete(id).then(()=>{
            console.log("Recipe deleted successfully");
            res.redirect('/home/profile');
        }) 
    } catch (error) {
        console.log(error);
        res.status(500).send('Error deleting recipe');
    }
    
    
});

module.exports = router;