const express=require('express')
const path=require('path')
const hbs=require('hbs')
var nodemailer = require('nodemailer');
const chalk = require('chalk');
const registeruser=require('./model/register')
require('./db/connection')
const app=express()



const viewspath=path.join(__dirname,'../tamplates/views')
const statpath=path.join(__dirname,'../public')
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set('view engine',"hbs")
app.set('views',viewspath)
app.use(express.static(statpath))
hbs.registerPartials(path.join(__dirname,'../tamplates/partials'))



app.get("/",(req,res)=>{
    res.render('index')
})
app.get("/forgot.hbs",(req,res)=>{
    res.render('forgot')
})
app.get("/index.hbs",(req,res)=>{
    res.render('index')
})
app.get("/register.hbs",(req,res)=>{
    res.render('register')
})
app.get("/logincheak",(req,res)=>{
    res.render('index')
})
app.get("/adddocument",(req,res)=>{
    res.render('adddocument')
})
app.get("/addaboutp",(req,res)=>{
    res.render('addaboutp')
})
app.get("/addnote",(req,res)=>{
    res.render('addnote')
})
app.get("/addpass",(req,res)=>{
    res.render('addpass')
})

//register user data
app.post("/register",async(req,res)=>{
    try{
        const data=new registeruser(req.body)
        const result=await data.save()
        res.end('welcome to the site'+req.body.username)
    }catch(err){
        res.render('register.hbs')
        console.log(chalk.red(err))
    }
})


//login cheaking
app.post("/logincheak",async(req,res)=>{
    try{
        console.log(req.body.email)
    const data=await registeruser.find({email:req.body.email})
    if(data[0].password==req.body.password){
        res.end('welcome back   '+data[0].username)
    }
    else{
        res.render('index')
    }
    }catch(err){
        res.render('index.hbs')
        console.log(chalk.red(err))
    }
})


//forgot password
app.post("/forgotpass.hbs",async(req,res)=>{
    try{
        let transport = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
               user: 'jkrathod2601@gmail.com',
               pass: 'RJ@$BORN@$2601'
            }
        });
        const message = {
            from: 'jkrathod2601@gmail.com', // Sender address
            to: req.body.email,         // List of recipients
            subject: 'Design Your Model S | Tesla', // Subject line
            text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
        };
        transport.sendMail(message, function(err, info) {
            if (err) {
              console.log(err)
            } else {
              console.log(info);
            }
        });
    }
    catch(err){
        console.log(err)
    }
})



app.listen(3000,()=>{
    console.log(chalk.green("connection succesfull"))
})

