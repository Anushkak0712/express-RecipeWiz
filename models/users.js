const express= require('express');
const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        validate:{
        validator: function(v){
            return /^[a-zA-Z0-9_]+$/.test(v)
        },
        message: "Username can only contain letters, numbers, and underscores"
    }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator:function(v){
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v)},
            message:"invalid email address"
        }
    },
    password:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model("user",userSchema)