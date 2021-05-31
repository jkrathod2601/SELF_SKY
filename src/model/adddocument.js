const mongoose=require('mongoose')

const adddocu=new mongoose.Schema({
    Dname:{
        type:String,
        require:true,
        unique:[true,'Dname is already taken']
    },
    validity:{
        type:Date
    },
    document_Number:{
        type:Number,
        require:true
    },
    Description:{
        type:String,
    },
    email:{
        type:String,
        require:true,
    }
})


const adddocuments=new mongoose.model('adddocuments',adddocu)
module.exports=adddocuments