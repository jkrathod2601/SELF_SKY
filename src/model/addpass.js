const mongoose=require('mongoose')

const pass=new mongoose.Schema({
    SiteName:{
        type:String,
        require:true,
    },
    username:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    Link_Of_Site:{
        type:String,
        require:false,
    },
    addemail:{
        type:String,
        require:true
    }
})


const addpassword=new mongoose.model('addpassword',pass)

module.exports=addpassword