const mongoose=require('mongoose')

const contactus=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        min:3,
    },
    email:{
            type:String,
            require:true,
    },
    message:{
        type:String,
        require:true
    },
})


const contact_us=new mongoose.model('contact_us',contactus)

module.exports=contact_us