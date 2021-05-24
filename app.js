require('dotenv').config()
const express = require('express');
const app = express();

const ejs = require('ejs');
app.set('view engine','ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const mongooseEncryption = require('mongoose-encryption');

app.use(express.static('public'));

app.listen(3000,function(){
  console.log('App launched Successfully');
});


app.get('/',function(req,res){
  res.render('home');
});

// user schema
const userSchema =  new mongoose.Schema({
  username: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  }
});

//mongoose encryption
userSchema.plugin(mongooseEncryption, { secret: process.env.SECRET, encryptedFields: ['password'] });

// user model
const User = new mongoose.model('User',userSchema);


//register chain get & post
app.route('/register')
  .get(function(req,res){
    res.render('register');
  })

  .post(function(req,res){
    //post one
    const newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    newUser.save(function(err,postUser){
      if(err){
        res.send(err);
      }
      else{
        res.render('secrets');
      }
    });
});

//register chain get & post
app.route('/login')
  .get(function(req,res){
    res.render('login');
  })

  .post(function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: req.body.username}, function(err,postLogin){
      if(err){
        res.send(err);
      }
      else if(postLogin.password == password){
        res.render('secrets');
      }
      else{
        res.send('Invalid Credentials')
      }
    })
});


app.get('/secrets',function(req,res){
  res.render('secrets');
});
