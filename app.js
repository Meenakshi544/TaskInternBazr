require('dotenv').config()

const express = require("express");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose=require("passport-local-mongoose");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb+srv://Meenakshi16:Taliking@420@cluster0.sfadn.mongodb.net/todolistDB?retryWrites=true&w=majority", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
mongoose.set("useCreateIndex",true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,

});
userSchema.plugin(passportLocalMongoose);


const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
  res.render("home");
})

app.get("/loggedin",(req,res) =>{
  if(req.isAuthenticated()){
    res.render("loggedIn");
  }
  else{
    res.redirect("/");
  }
});
app.get("/logout",(req,res)=>{
  req.logout();
  res.redirect("/");
});

app.post("/",(req,res)=>{
  User.register({username : req.body.username}, req.body.password,(err,user)=>{
    if(err){
      res.redirect("/");
    }
    else{
      passport.authenticate("local")(req, res, ()=>{

        res.redirect("/loggedin");
      } );
    }
  });


});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
