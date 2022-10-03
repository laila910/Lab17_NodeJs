const express = require('express');
const bodyParser = require('body-parser');
const cookieParser=require('cookie-parser');
const cors = require('cors');
const app =express();
const mongodb = require("mongodb");

// connect to database
const dbclient = new  mongodb.MongoClient("mongodb://localhost:27017");


dbclient.connect();

const db = dbclient.db("Lab2_NodeJs");

// use body Parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// use Cookie Parser
app.use(cookieParser());

// use ejs
app.set("view engine","ejs");
app.use(cors());
// Welcome Page (home page)
app.get("/",function(req,res){
   res.render('index.ejs',{user:'',name:'',msg:'welcome'});
});

// Sign Up Page
app.get("/signUp",function(req,res){
  res.render('signUp.ejs');
});
// Handle Sign Up Data
app.post("/signUpUser",function(req,res){
 db.collection("users").insertOne(req.body);
 res.render('index.ejs',{user:'',name:'No User',msg:'signUp Success Please Login Now'});
});
// Login Page
app.get("/login",function(req,res){
    res.render("login.ejs");
});

// Handle login data
app.post("/loginUser",async function(req,res){
 var user=await db.collection("users").find({name:req.body.name}).toArray();

    if(user[0] && req.body.password == user[0].password){
        user[0].Uid=Math.random();
        res.cookie("Uid",user[0].Uid);
        res.render('index.ejs',{user:user[0],name:user[0].name,msg:'login Success'});

    }else{
        res.render('index.ejs',{user:'',name:'No User',msg:'login Failed'});
    }
});

// Handle Logout
app.get('/logout',function(req,res){
    res.cookie("Uid","");
    res.render('index.ejs',{user:'',name:'No User',msg:'logout success'});
});
app.listen(8080);