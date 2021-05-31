const mongoose=require('mongoose')

const register=new mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:3,
        unique:[true,'username is already taken']
    },
    email:{
        type:String,
        require:true,
        unique:[true,'email is already taken']
    },
    password:{
            type:String,
            require:true,
    },
    number:{
        type:String,
        require:true,
        unique:[true,'number is already taken']
    },
    agree:{
        type:String
    }
})


const Registeruser=new mongoose.model('Registeruser',register)

module.exports=Registeruser