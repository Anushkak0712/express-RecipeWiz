const express= require('express');
const mongoose=require('mongoose');
const ratingSchema=require('./ratings')
const recipeSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:false,
        },
    username:{
        type:String,
        required:true,
        validate:{
        validator: function(v){
            return /^[a-zA-Z0-9_]+$/.test(v)
        },
        message: "Username can only contain letters, numbers, and underscores"
    }
    },
    image:{
        type:String,
        default:"/images/default-recipe.jpg"
    },
    description:{
        type:String,
        required:true,
        unique:false,
    },
    cuisine:{
        type:String,
        required:true
    },
    ingredients:[{
        type:String
    }],
    details:{
        type:String,
        required:false
    },
    timeRequired:{
        type:String,
        required:true
    },
    ratings:[
        ratingSchema
    ],
    sharedAt:{
        type:Date,
        required:true
    },
    totalRating:{
        type:Number,
        default:0
    }
})

module.exports=mongoose.model("recipe",recipeSchema)