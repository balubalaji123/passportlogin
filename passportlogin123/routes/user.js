const express=require('express')
const router=express.Router();
const bcrypt=require('bcryptjs')
const passport=require('passport')
const User=require('../model/User')
const randomstring=require('randomstring');
router.get('/login',(req,res)=>res.render('login'));
router.get('/register',(req,res)=>res.render('register'));
router.post('/register',(req,res)=>{
    const {name,email,password,password2}=req.body;
    let errors=[]
    //check for conditions
    if(!name || !email||!password||!password2){
        errors.push({msg:'all fields are required'});
    }
    if(password!==password2){
        errors.push({msg:'passwors are not matched'});
    }
    if(password.length<6){
        errors.push({msg:'password atleast 6 characters'});
    }
    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }else{
    //validation passed
    User.findOne({email:email})
    .then(user=>{
        if(user){
            errors.push({msg:'email already exists'});
            res.render('register',{
                errors,
                name,
                email,
                password,
                password2
            });
        
        }else{
            const newUser=new User({
                name,
                email,
                password
            });
            bcrypt.genSalt(10,(err,salt)=>
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err) throw err;
                newUser.password=hash;
                newUser.save()
                .then(user=>{
                    req.flash('success_msg','you are now registered you csn ogin in now');
                    res.redirect('/user/login')
                })
                .catch(err=>console.log(err));
            })
            )
        }


    });

    }
});
router.get('/auth/facebook',passport.authenticate('facebook',{scope: ['email']}));
router.get('/auth/facebook/callback',
passport.authenticate('facebook',{
    successRedirect:'/dashboard',
    failureRedirect:'/register'
}))



router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/user/login',
        failureFlash:true
    })(req,res,next);
});

router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('sucess_msg','you are logged out');
    res.redirect('/user/login')
});

module.exports=router;