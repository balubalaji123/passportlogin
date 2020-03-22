const express=require('express')
const expresslayouts=require('express-ejs-layouts')
const mongoose=require('mongoose')
const passport=require('passport')
const app=express();
require('./config/passport')(passport)
const flash=require('connect-flash')
const session=require('express-session');
//mangodb
const db=require('./config/keys').MongoURI
//mongodb connection
mongoose.connect(db,{useNewUrlParser:true})
.then(()=>console.log('connected'))
.catch(err=>console.log(err))
app.use(expresslayouts)
app.set('view engine','ejs')
//bodyparser
app.use(express.urlencoded({extended:false}))
//express session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));
app.use(passport.initialize())
app.use(passport.session());
app.use(flash());
//global variables
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');

    next();
})


app.use('/',require('./routes/index'));
app.use('/user',require('./routes/user'));
const port=process.env.port ||3000
app.listen(port)    