'use strict';

module.exports = function(){
    return {
        SignUpValidation: (req,res,next) => {
            req.checkBody('username','Username is Required').notEmpty();
            req.checkBody('username','Username must not be less than 5').isLength({min: 5});
            
            req.checkBody('ads','ADS Id is Required').notEmpty();
            req.checkBody('ads','ADS Id is Invalid').isLength({min:8});
            
            req.checkBody('password','Password is Required').notEmpty();
            req.checkBody('password','Password must not be less than 5').isLength({min:5});
            
            req.getValidationResult()
                .then((result) => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach((error) => {
                        messages.push(error.msg);
                });
                
                req.flash('error', messages);
                res.redirect('/signup');
                })
                .catch((error)=>{
                    return next();
                })
        },
        
        LoginValidation: (req,res,next) => {
            req.checkBody('ads','ADS Id is Required').notEmpty();
            req.checkBody('ads','ADS Id is Invalid').isLength({min:8});
            
            req.checkBody('password','Password is Required').notEmpty();
            req.checkBody('password','Password must not be less than 5').isLength({min:5});
            
            req.getValidationResult()
                .then((result) => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach((error) => {
                        messages.push(error.msg);
                });
                
                req.flash('error', messages);
                res.redirect('/');
                })
                .catch((error)=>{
                    return next();
                })
        }
    }
}













