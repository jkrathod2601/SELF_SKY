const express=require('express')
const path=require('path')
const hbs=require('hbs')
var nodemailer = require('nodemailer');
const chalk = require('chalk');
const app=express()
const Cryptr = require('cryptr');
const randomize = require('randomatic');
var md5 = require('md5');

const registeruser=require('./model/register')
const noteadd=require('./model/note')
const addpop=require('./model/addp')
const contactus=require('./model/contactus')
const adddocument=require('./model/adddocument');
const contact_us = require('./model/contactus');
const addpass=require('./model/addpass');


require('./db/connection')



const viewspath=path.join(__dirname,'../tamplates/views')
const statpath=path.join(__dirname,'../public')

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set('view engine',"hbs")
app.set('views',viewspath)
app.use(express.static(statpath))
hbs.registerPartials(path.join(__dirname,'../tamplates/partials'))


var email;
var access=false;
var pin1;




app.get("/start",async(req,res)=>{
    const user=await registeruser.count()
    res.render('start',{
        countuser:user
    })
})
app.get("/",(req,res)=>{
    res.render('index')
})
app.get("/forgot.hbs",(req,res)=>{
    res.render('forgot')
})

app.get("/index.hbs",(req,res)=>{
    res.render('index')
})
app.get("/passgene",(req,res)=>{
    res.render('passgenerator')
})
app.get("/register.hbs",(req,res)=>{
    res.render('register')
})
app.get("/contactus.hbs",(req,res)=>{
    res.render('contactus')
})
app.get("/logincheak",(req,res)=>{
    res.render('index')
})
app.get("/adddocument",(req,res)=>{
    
    if(access==true){
        res.render('adddocument')
    }
    else{
        res.redirect('/')
    }
})
app.get("/addaboutp",(req,res)=>{
    if(access==true){
        res.render('addaboutp')
    }
    else{
        res.redirect('/')
    }
})
app.get("/addnote",(req,res)=>{
     if(access==true){
        res.render('addnote')
    }
    else{
        res.redirect('/')
    }})
app.get("/addpass",(req,res)=>{
   
    if(access==true){
        res.render('addpass')
    }
    else{
        res.redirect('/')
    }
})
app.get('/logout',(req,res)=>{
    access=false
    console.log(access)
    email=""
    res.redirect('/')
    
})

//register user data //done
app.post("/register",async(req,res)=>{
    try{

        const pin = await randomize('Aa0!',8)
        const cryptr=new Cryptr(pin)
        pin1=pin
        const data=new registeruser({
            username:cryptr.encrypt(req.body.username),
            email:req.body.email,
            password:md5(req.body.password),
            number:cryptr.encrypt(req.body.number),
            agree:req.body.agree
        })
        const result=await data.save()
        email=req.body.email
        console.log(result)
        access=true;

        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
               user:'jkrathod2601@gmail.com',
               pass:'*******'
            }
        });
        const message = {
            from: 'jkrathod2601@gmail.com', // Sender address
            to: req.body.email,         // List of recipients
            subject: "your all time security pin is", // Subject line
            html:'<h3>Your Pin is</h3><h1>'+pin+'</h1>'// Plain text body
        };
        await transport.sendMail(message, function(err, info) {
            if (err) {
              console.log(err)
            } else {
              console.log(info);
            }
        });
        res.redirect('/profile')
    }catch(err){
        res.render('register.hbs',{
            error:"email is allready taken"
        })
        console.log(chalk.red(err))
    }
})

//login cheaking
app.post("/logincheak",async(req,res)=>{
    try{
    //    pin1="BSG2F"
    var error1,error2=""
    const data=await registeruser.find({email:req.body.email})
    
    if(data[0].password==md5(req.body.password)){
        email=req.body.email
        access=true;
        res.render('pin')
        }
        else{
            res.render('index',{
                errorr1:error1,
                error2:'password does not match with email'
            })
        }
    }catch(err){
        res.render('index',{
            error1:'email is not found in database',
            error2:error2
        })
        console.log(chalk.red(err))
    }
})
//set pin
app.post('/setpin',async(req,res)=>{
    try{
        pin1=await req.body.pin
        console.log(pin1)
        res.redirect('/profile')
    }catch(err){
        console.log(err)
    }
})

//forgot password
app.post("/forgotpass.hbs",async(req,res)=>{
    try{
        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
               user:'jkrathod2601@gmail.com',
               pass:'********'
            }
        });
        const result = await registeruser.find({email:req.body.email})
        const data=await result[0].password
        var id=await result[0]._id
        console.log(data)
        if(data.length>0){
           
            console.log(id)
            const randome = await randomize('Aa0!',10)
            const result=await registeruser.findByIdAndUpdate({_id:id},{
                password:md5(randome)
            })
            const message = {
                from: 'jkrathod2601@gmail.com', // Sender address
                to: req.body.email,         // List of recipients
                subject: "your password is", // Subject line
                html: '<h3>your new password is </h3><br><h1>'+randome+'<h1>' // Plain text body
            };
            transport.sendMail(message, function(err, info) {
                if (err) {
                  console.log(err)
                } else {
                  console.log(info);
                }
            });
            res.render('index')
            console.log(true)
        }else{
            res.render('forgot.hbs',{
                error:'your email is not found in database'
            })
            console.log(false)
        }
    }
    catch(err){
        res.render('forgot.hbs',{
            error:'your email is not found in database'
        })
        console.log(err)
    }
})


//adding a note
app.post('/noteadd',async(req,res)=>{
    try{
        var cryptr=new Cryptr(pin1)
        const datanote=new noteadd({
            title:await cryptr.encrypt(req.body.title),
            date:req.body.date,
            description:await cryptr.encrypt(req.body.description),
            email:email
        })
        const result=await datanote.save()
        console.log(chalk.green('data added succesfully'))
        res.redirect('/allnote')
    }catch(err){
        console.log(chalk.red(err))
        res.redirect('/allnote')
    }
})

//adding a people
app.post('/addpeople',async(req,res)=>{
    try{
        var cryptr=new Cryptr(pin1)
        const datap=new addpop({
            name:await cryptr.encrypt(req.body.name),
            phone:(req.body.phone),
            email:await cryptr.encrypt(req.body.email),
            instagram:await cryptr.encrypt(req.body.instagram),
            twitter:await cryptr.encrypt(req.body.twitter),
            github:await cryptr.encrypt(req.body.github),
            address:await cryptr.encrypt(req.body.address),
            addemail:email
        })
        const result=await datap.save()
        console.log(result)
        console.log(chalk.green("people data added succesfully"))
        res.redirect('/abps')
    }catch(err){
        res.redirect('/abps')
        console.log(chalk.red(err))
    }
})


//add document
app.post('/adddocuments',async(req,res)=>{
    try{
        var cryptr=new Cryptr(pin1)
        const datadocu=new adddocument({
            Dname:await cryptr.encrypt(req.body.Dname),
            validity:(req.body.validity),
            document_Number:(req.body.document_Number),
            Description:await cryptr.encrypt(req.body.Description),
            email:email
        })
        const result=datadocu.save()
        console.log(chalk.green(result))
        res.redirect('/alldock')
    }catch(err){
        console.log(chalk.red(err))
        res.redirect('/alldock')
    }
})

//contact us 
app.post('/contactus',async(req,res)=>{
    try{
        const data=new contactus(req.body)
        const result =await data.save()
        console.log(chalk.green("data added succesfully contact use"))
        res.redirect('/profile')
    }catch(err){
        console.log(chalk.red(err))
    }
})

//add password
app.post('/addpassword',async(req,res)=>{
    try{
        const cryptr=new Cryptr(pin1)
        const datapass=new addpass({
            SiteName:cryptr.encrypt(req.body.SiteName),
            username:cryptr.encrypt(req.body.username),
            password:cryptr.encrypt(req.body.password),
            Link_Of_Site:cryptr.encrypt(req.body.Link_Of_Site),
            addemail:email
        })
        const result=datapass.save()
        console.log(chalk.green(result))
        res.redirect('/allpass')
    }catch(err){
        console.log(chalk.red(err))
        res.redirect('/allpass')
    }
})


//profile page //done
app.get("/profile",async(req,res)=>{
    try{
        var cryptr=new Cryptr(pin1)
        console.log(access)
        if(access==true){
            const totalpass =await addpass.find({addemail:email}).count()
            const totaldocs =await adddocument.find({email:email}).count()
            const totalaboutp=await addpop.find({addemail:email}).count()
            const totalnote=await noteadd.find({email:email}).count()
            const nameof=await registeruser.find({email:email})
            const username=await cryptr.decrypt(nameof[0].username)
            const password=(nameof[0].password)
            const number=await cryptr.decrypt(nameof[0].number)
            res.render('profile',{
                totalaboutp:totalaboutp,
                totaldocs:totaldocs,
                totalpass:totalpass,
                totalnote:totalnote,
                email:email,
                username:username,
                password:password,
                number:number
            })
        }
        else{
            res.redirect('/')
        }
    }catch(err){
        console.log(chalk.red(err))
        res.redirect('/')
    }
})



//about people api
app.get("/abpapi",async(req,res)=>{
    try{
        const data=await addpop.find({addemail:email})
        console.log(email)
        console.log(data)
        var cryptr=new Cryptr(pin1)
        var string1=''
        for(var i=0;i<data.length;i++){
        var name=await cryptr.decrypt(data[i].name)
        var emaild=await cryptr.decrypt(data[i].email)
        var instagram=await cryptr.decrypt(data[i].instagram)
        var twitter=await cryptr.decrypt(data[i].twitter)
        var github=await cryptr.decrypt(data[i].github)
        var phone=await (data[i].phone)
        var _id=await data[i]._id
        var string='{"_id":"'+_id+'","name":"'+name+'","instagram":"'+instagram+'","twitter":"'+twitter+'","github":"'+github+'","email":"'+emaild+'","phone":"'+phone+'"},'
        string1=string1+string
    }
    console.log('['+string1.slice(0,string1.length-1)+']')
    res.send(JSON.parse('['+string1.slice(0,string1.length-1)+']'))
    }catch(err){
        console.log(err)
    }
})
//about people page
app.get("/abps",(req,res)=>{
    if(access==true){
        res.render('abp')
    }
    else{
        res.redirect('/')
    }
   
})
//delete about people
app.get("/deleteabp/:id",async(req,res)=>{
    try{
        if(access==true){
            const id=req.params.id
            console.log(id)
           const result=await addpop.findByIdAndDelete(id)
           console.log(chalk.green(result))
           res.redirect('/abps')
        }
        else{
            res.redirect('/')
        }
    }
    catch(err){
        console.log(chalk.red(err))
        res.redirect('/abps')
    }
})
//update people form
app.get('/updatepeople/:id',async(req,res)=>{
    try{
        if(access==true){
            var cryptr=new Cryptr(pin1)
            const id=req.params.id
            const data=await addpop.find({_id:id})
            //console.log(data[0].address)
            res.render('updatepeople',{
                name:await cryptr.decrypt(data[0].name),
                phone:data[0].phone,
                email:await cryptr.decrypt(data[0].email),
                instagram:await cryptr.decrypt(data[0].instagram),
                twitter:await cryptr.decrypt(data[0].twitter),
                github:await cryptr.decrypt(data[0].github),
                id:data[0]._id,
                address:await cryptr.decrypt(data[0].address)
            })
        }
        else{
            res.redirect('/')
        }
    }catch(err){
        console.log(chalk.red(err))
        res.redirect('/abps')
    }
})
//update people
app.post('/updatepeopleform/:id',async(req,res)=>{
    try{
        if(access==true){
            var cryptr=new Cryptr(pin1)
            const id=req.params.id
        const result=await addpop.findByIdAndUpdate({_id:id},{
            name:await cryptr.encrypt(req.body.name),
            phone:req.body.phone,
            email:await cryptr.encrypt(req.body.email),
            instagram:await cryptr.encrypt(req.body.instagram),
            twitter:await cryptr.encrypt(req.body.twitter),
            github:await cryptr.encrypt(req.body.github),
            address:await cryptr.encrypt(req.body.address)
        })
        console.log(chalk.blue('data updated suucswfully'))
        res.redirect('/abps')
        }
        else{
            res.redirect('/')
        }
    }catch(err){
        console.log(chalk.red(err))
        res.redirect('/abps')
    }
})


// note api
app.get('/apinote',async(req,res)=>{
    try{
        var cryptr=new Cryptr(pin1)
        const data=await noteadd.find({email:email})
        var string1=''
        for(var i=0;i<data.length;i++){
        var title=await cryptr.decrypt(data[i].title)
        var description=await cryptr.decrypt(data[i].description)
        var date=await (data[i].date)
        var _id=await data[i]._id
        console.log(description)
        var string='{"_id":"'+_id+'","title":"'+title+'","date":"'+date+'","description":"'+description+'"},'
        string1=string1+string
    }
    console.log('['+string1.slice(0,string1.length-1)+']')
    res.send(JSON.parse('['+string1.slice(0,string1.length-1)+']'))
        
    }catch(err){
        console.log(err)
    }
   
})
//give note
app.get('/allnote',(req,res)=>{
    if(access==true){
        res.render('allnote')
    }
    else{
        res.redirect('/')
    }
})
//delete note
app.get("/deletenote/:id",async(req,res)=>{
    try{
        if(access==true){
            const id=req.params.id
            console.log(id)
           const result=await noteadd.findByIdAndDelete(id)
           console.log(chalk.green(result))
           res.redirect('/allnote')
        }
        else{
            res.redirect('/')
        }
       
    }
    catch(err){
        console.log(chalk.red(err))
        res.redirect('/allnote')
    }
})
//update note form
app.get('/updatenote/:id',async(req,res)=>{
    try{
        if(access==true){
            var cryptr=new Cryptr(pin1)
            const id=req.params.id
            const data=await noteadd.find({_id:id})
            //console.log(data[0].address)
            res.render('updatenote',{
                title:await cryptr.decrypt(data[0].title),
                description:await cryptr.decrypt(data[0].description),
                id:data[0]._id
            })
        }
        else{
            res.redirect('/')
        }
       
    }catch(err){
        console.log(chalk.red(err))
        res.redirect('/allnote')
    }
})
//update note from
app.post('/updatenoteform/:id',async(req,res)=>{
    try{
        if(access==true){
            var cryptr=new Cryptr(pin1)
            const id=req.params.id
            const result=await noteadd.findByIdAndUpdate({_id:id},{
                title:await cryptr.encrypt(req.body.title),
                description:await cryptr.encrypt(req.body.description),
            })
            console.log(chalk.blue('data updated suucswfully'))
            res.redirect('/allnote')
        }
        else{
            res.redirect('/')
        }
    }catch(err){
        console.log(chalk.red(err))
        res.redirect('/allnote')
    }
})


// document api
app.get('/apidock',async(req,res)=>{
    try{
        var cryptr=new Cryptr(pin1)
        const data=await adddocument.find({email:email})
        var string1=''
        for(var i=0;i<data.length;i++){
        var Dname=await cryptr.decrypt(data[i].Dname)
        var Description=await cryptr.decrypt(data[i].Description)
        var validity=await (data[i].validity)
        var document_Number=await (data[i].document_Number)
        var _id=await data[i]._id
        var string='{"_id":"'+_id+'","Dname":"'+Dname+'","Description":"'+Description+'","validity":"'+validity+'","document_Number":"'+document_Number+'"},'
        string1=string1+string
    }
    console.log('['+string1.slice(0,string1.length-1)+']')
    res.send(JSON.parse('['+string1.slice(0,string1.length-1)+']'))
    }catch(err){
        res.redirect('/profile')
        console.log(err)
    }
    
})
//give dock
app.get('/alldock',(req,res)=>{
    if(access==true){
        res.render('alldock')
    }
    else{
        res.redirect('/')
    }
   
})
//delete dock
app.get("/deletedock/:id",async(req,res)=>{
    try{
        if(access==true){
            const id=req.params.id
            console.log(id)
           const result=await adddocument.findByIdAndDelete(id)
           console.log(chalk.green(result))
           res.redirect('/alldock')
        }
        else{
            res.redirect('/')
        }
      
    }
    catch(err){
        console.log(chalk.red(err))
        res.redirect('/alldock')
    }
})
//update dock form
app.get('/updatedock/:id',async(req,res)=>{
    try{
        if(access==true){
            var cryptr=new Cryptr(pin1)
            const id=req.params.id
            console.log(id)
            const data=await adddocument.find({_id:id})
            //console.log(data[0].address)
            res.render('updatedock',{
                Dname:await cryptr.decrypt(data[0].Dname),
                Description:await cryptr.decrypt(data[0].Description),
                document_Number:data[0].document_Number,
                id:data[0]._id,
                date:data[0].date
            })
        }
        else{
            res.redirect('/')
        }
       
    }catch(err){
        console.log(chalk.red(err))
        res.redirect('/alldock')
    }
})
//update dock from
app.post('/updatedockform/:id',async(req,res)=>{
    try{
        if(access==true){
            var cryptr=new Cryptr(pin1)
            const id=req.params.id
            const result=await adddocument.findByIdAndUpdate({_id:id},{
                Dname:await cryptr.encrypt(req.body.Dname),
                Description:await cryptr.encrypt(req.body.Description),
                document_Number:req.body.document_Number,
                date:req.body.date
            })
            console.log(chalk.blue('data updated suucswfully'))
            res.redirect('/alldock')
        }
        else{
            res.redirect('/')
        }
        
    }catch(err){
        console.log(chalk.red(err))
        res.redirect('/alldock')
    }
})


// password api
app.get('/apipass',async(req,res)=>{
    try{
    var cryptr=new Cryptr(pin1)
    const data=await addpass.find({addemail:email})
    console.log(typeof(data))
    var string1=''
    for(var i=0;i<data.length;i++){
        var username=await cryptr.decrypt(data[i].username)
        var SiteName=await cryptr.decrypt(data[i].SiteName)
        var password=await cryptr.decrypt(data[i].password)
        var Link_Of_Site=await cryptr.decrypt(data[i].Link_Of_Site)
        var _id=await data[i]._id
        var string='{"_id":"'+_id+'","username":"'+username+'","SiteName":"'+SiteName+'","Link_Of_Site":"'+Link_Of_Site+'","password":"'+password+'"},'
        string1=string1+string
        console.log(string1)
    }
    res.send(JSON.parse('['+string1.slice(0,string1.length-1)+']'))
    }catch(err){
        console.log(err)
    }
    
})
//give pass
app.get('/allpass',(req,res)=>{
    if(access==true){
        res.render('allpass')
    }
    else{
        res.redirect('/')
    }
})
//delete pass
app.get("/deletepass/:id",async(req,res)=>{
    try{
        if(access==true){
            const id=req.params.id
            console.log(id)
           const result=await addpass.findByIdAndDelete(id)
           console.log(chalk.green(result))
           res.redirect('/allpass')
        }
        else{
            res.redirect('/')
        }
    }
    catch(err){
        console.log(chalk.red(err))
        res.redirect('/allpass')
    }
})
//update pass form
app.get('/updatepass/:id',async(req,res)=>{
    try{
        var cryptr=new Cryptr(pin1)
        if(access==true){
            const id=req.params.id
        const data=await addpass.find({_id:id})
        //console.log(data[0].address)
        res.render('updatepass',{
            SiteName:await cryptr.decrypt(data[0].SiteName),
            username:await cryptr.decrypt(data[0].username),
            password:await cryptr.decrypt(data[0].password),
            id:data[0]._id,
            Link_Of_Site:await cryptr.decrypt(data[0].Link_Of_Site)
        })
        }
        else{
            res.redirect('/')
        }
       
    }catch(err){
        console.log(chalk.red(err))
        res.redirect('/allpass')
    }
})
//update pass from
app.post('/updatepassform/:id',async(req,res)=>{
    try{
        var cryptr=new Cryptr(pin1)
        if(access==true){
            const id=req.params.id
        const result=await addpass.findByIdAndUpdate({_id:id},{
            SiteName:await cryptr.encrypt(req.body.SiteName),
            username:await cryptr.encrypt(req.body.username),
            password:await cryptr.encrypt(req.body.password),
            Link_Of_Site:await cryptr.encrypt(req.body.Link_Of_Site)
        })
        console.log(chalk.blue('data updated suucswfully'))
        res.redirect('/allpass')
        }
        else{
            res.redirect('/')
        }
        
    }catch(err){
        console.log(chalk.red(err))
        res.redirect('/allpass')
    }
})


app.get('/deleteaccout',async(req,res)=>{
    try{
            const result2=await noteadd.deleteMany({email:email})
            const result3=await adddocument.deleteMany({email:email})
            const result4=await addpass.deleteMany({addemail:email})
            const result5=await addpop.deleteMany({addemail:email})
            console.log('datadeleted succesfully')
    console.log('deleation sucessfull')
    // console.log(result)
    res.redirect('/profile')
    }catch(err){
        res.redirect('/profile')
        console.log(err)
    } 
})


app.get('/deletedatawithaccount',async(req,res)=>{
    try{    
        if(access==true){
         const result=await registeruser.find({email:email})
         const id=result[0]._id
         const result1=await registeruser.findByIdAndDelete({_id:id})
         const result22=await noteadd.deleteMany({email:email})
         const result32=await adddocument.deleteMany({email:email})
         const result42=await addpass.deleteMany({addemail:email})
         const result52=await addpop.deleteMany({addemail:email})
            
            res.redirect('/')
        }
        else{
            res.redirect('/')
        }
        
    }catch(err){
        console.log(chalk.red('some error throw out deleteaccountdata'+err))
        res.redirect('/profile')
        
    }
})


app.get("*",(req,res)=>{
    res.render('404')
})


app.listen(3000,()=>{
    console.log(chalk.green("connection succesfull"))
})

