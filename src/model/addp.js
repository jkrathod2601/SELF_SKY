const mongoose=require('mongoose')

const peop=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        min:3,
    },
    phone:{
        type:Number,
        require:true,
    },
    email:{
            type:String,
            require:true,
    },
    instagram:{
        type:String,
        require:false,
    },
    twitter:{
        type:String,
        require:false,
    },
    github:{
        type:String,
        require:false,
    },
    address:{
        type:String,
        require:true
    },
    addemail:{
        type:String,
        require:true
    }
})


const addpeople=new mongoose.model('addpeople',peop)

module.exports=addpeople