const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const configAuth=require('./auth');
const FacebookStrategy = require('passport-facebook').Strategy;


// Load User model
const User = require('../model/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      user.findOne({'facebook.id':profile.id},function(err,user){
        if(err)
        return done(err)
        if(user)
        return done(null,user);
        else{
          var newUser=new user();
          newUser.facebook.id=profile.id;
          newUser.facebook.token=accessToken;
          newUser.facebook.name=profile.name.giveName+''+profile.name.familyNmame
          newUser.facebook.email=profile.emails[0].value;
          newUser.save(function(err){
            if(err)
            throw  err
            return done(null,newUser)
          })
        }
      })
    })
  
  }
));







  
};