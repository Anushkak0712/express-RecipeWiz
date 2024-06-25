var express = require('express');
const auth=require('../auth');
var router = express.Router();
const recipe=require('../models/recipes')

router.get('/',auth.isLoggedIn,async(req,res)=>{
    const username = req.user.username; // Assuming the JWT token contains a `username` field
    try {
      const recipes = await recipe.find().sort({totalRating:'desc'}).limit(3);
      res.render('home', { recipes:recipes });
    } catch (err) {
        console.log(err)
      res.status(500).send('Server Error');
    }
  })
router.get('/trending',async(req,res)=>{
    try {
        const recipes = await recipe.find().sort({totalRating:'desc'});
        res.render('cuisine', { recipes:recipes,title :'trending' });
      } catch (err) {
          console.log(err)
        res.status(500).send('Server Error');
      }
})
router.get("/search",async(req,res)=>{
    try{
        const title=req.query.search;
        const recipes = await recipe.find({title:{$regex:title,$options:'i'}});
        //console.log(recipes.length===0)
        if (recipes.length===0){
            return res.send("no recipes found try some other title")
        }
        res.render('cuisine', { recipes:recipes,title :'Search Results' });
    }
    catch(error){
        console.log(error)
    }
})
router.get('/viewRecipe',async (req,res)=>{
    try {
        const recipe_id=req.query.id;
        const Recipe= await recipe.find({_id:recipe_id});
    

        console.log(recipe_id)
        
        res.render('viewRecipe',{recipe:Recipe[0]});
        
    } catch (error) {
        console.log(error)
    }})
function newRating(recipe_id,username,star){
    async()=>{
    const Recipe=await recipe.findByIdAndUpdate(recipe_id,
        {$push:
            {ratings:
                {recipe_id,username,star}
            }
        },
        {
        new:true
        }
    );
    //console.log(Recipe);
    const getRecipe=await recipe.findById(recipe_id);
    const ratingsCount=getRecipe.ratings.length;
    const ratingsSum=getRecipe.ratings.reduce((sum,rating)=>sum+rating.star,0);
    const totalRating=Math.round(ratingsSum/ratingsCount);
    await recipe.findByIdAndUpdate(recipe_id,{totalRating});
    const finalrecipe=await recipe.findById(recipe_id);
    res.json({finalrecipe});}
}
router.post("/viewRecipe/rating",auth.isLoggedIn,async(req,res)=>{
    try{
        const username=req.user.username;
        const recipe_id=req.body.recipe_id;
        const star=req.body.star;
        const viewedRecipe=await recipe.findOne({_id:recipe_id})
        //console.log(viewedRecipe);
        if(viewedRecipe.ratings && viewedRecipe.ratings.length){
        const alreadyRated=viewedRecipe.ratings.find((rating)=>rating.username===username);
        
        if(alreadyRated){
            console.log(alreadyRated);
            const updateRating= await recipe.updateOne(
                {
                    ratings:{$elemMatch:alreadyRated}
                },
                {
                    $set:{"ratings.$.star":star}
                },
                {
                    new:true
                }
            )
        }
        else{
            const Recipe=await recipe.findByIdAndUpdate(recipe_id,
                {$push:
                    {ratings:
                        {recipe_id,username,star}
                    }
                },
                {
                new:true
                }
            );
            //console.log(Recipe);
           
        }
    }else{
        const Recipe=await recipe.findByIdAndUpdate(recipe_id,
            {$push:
                {ratings:
                    {recipe_id,username,star}
                }
            },
            {
            new:true
            }
        );
    }
    const getRecipe=await recipe.findById(recipe_id);
    const ratingsCount=getRecipe.ratings.length;
    const ratingsSum=getRecipe.ratings.reduce((sum,rating)=>sum+rating.star,0);
    const totalRating=Math.round(ratingsSum/ratingsCount);
    await recipe.findByIdAndUpdate(recipe_id,{totalRating});
    const finalrecipe=await recipe.findById(recipe_id);
    res.redirect(`/home/viewRecipe?id=${recipe_id}`);

    }
    catch(error){
        console.log(error)
    }
})

router.get('/explore/:cuisine',async(req,res)=>{
    try {
        const cuisine=req.params.cuisine
        const recipes= await recipe.find({
            cuisine:req.params.cuisine
        })
        //console.log(recipes,cuisine);
        res.render('cuisine',{recipes,tile:cuisine});
    } catch (error) {
        console.log(error)
    }
})
module.exports = router;