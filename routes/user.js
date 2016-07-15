var router = require('express').Router();
var User = require('../models/user'); // one dot for going out of router folder and one dot for refering to .models folder as usual
var passport = require('passport');
var passportConfig = require('../config/passport');

router.get('/login',function(req,res){
  //if user is logged in rediect him to home page
  if(req.user) return res.redirect('/');
  //if user is not logged in render login page
  res.render('accounts/login',{message:req.flash('loginMessage')});
});

router.post('/login',passport.authenticate('local-login',{
  successRedirect:'/profile',
  failureRedirect:'/login',
  failureFlash:true
}));

router.get('/profile',function(req,res,next){
  User.findOne({_id:req.user._id},function(err,user){
    if(err) return next(err);
    res.render('accounts/profile',{user:user});
  });
});

router.get('/signup',function(req,res,next){
  res.render('accounts/signup',{
    errors:req.flash('errors')  // here we are sending errors object for get request .. we will get it in signup page by using same object errors
  });
});

router.post('/signup',function(req,res,next){
  var user = new User;

  user.profile.name  = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;

  //findOne is a mongoose function which will find only one document from the database
  User.findOne({email:req.body.email},function(err,existingUser){
    if(existingUser){
      req.flash('errors','Account with that email already exists');
      return res.redirect('/signup');
    }else{
      user.save(function(err,user){
        if(err) return next(err);
        return res.redirect('/');
      });
    }
  });
});

router.get('/logout',function(req,res,next){
  req.logout();
  res.redirect('/');
});

module.exports = router;
