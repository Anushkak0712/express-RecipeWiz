const express= require('express');
const mongoose=require('mongoose');
const ratingSchema=mongoose.Schema({
recipe_id:{
    type:String,
    required:true
},
username:{
    type:String,
    required:true
},
star:{
    type:Number,
    required:true
}
})

module.exports=ratingSchema;