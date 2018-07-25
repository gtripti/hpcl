'use strict';

const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

//which data will be saved in the session 
passport.serializeUser((user,done) => {
    done(null,user.id);//callback
});


passport.deserializeUser((id, done) =>{
    User.findById(id,(err,user)=>{
        done(err,user);
    });
});

//passport midway
passport.use('local.signup', new LocalStrategy({
    usernameField: 'ads',
    passwordField: 'password',
    passReqToCallback: true
}, (req, ads, password, done) => {
    
    User.findOne({'ads': ads}, (err,user) => {
        if(err){//network error etc
            return done(err);
        }
        
        if(user){//already exists
            return done(null,false, req.flash('error','User with ADS Id already exists'));
        }
        
        //save data in db
        //console.log('Connected to db');
        const newUser = new User();
        newUser.username = req.body.username;
        newUser.ads = req.body.ads;
        newUser.password = newUser.encryptPassword(req.body.password);
        
        console.log(newUser);
        newUser.save(function(err) {
            done(null, newUser);
            /*if(err) throw err;
            console.log('Saved record');*/
        });
        //console.log('Saved in db');
    });
    
}));


passport.use('local.login', new LocalStrategy({
    usernameField: 'ads',
    passwordField: 'password',
    passReqToCallback: true
}, (req, ads, password, done) => {
   
    //checks ads in db
    User.findOne({'ads': ads}, (err,user) => {
        if(err){
            return done(err);
        }
        
        const messages = [];
        if(!user || !user.validUserPassword(password)){
            messages.push('ADS Id Doesnt exist or Password is Invalid');
            return done(null, false, req.flash('error',messages));
        }
        
        return done(null,user);
        
    });
    
}));



















