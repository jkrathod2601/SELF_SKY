const mongoose=require('mongoose')

const noteadd=new mongoose.Schema({
    title:{
        type:String,
        require:true,
    },
    date:{
        type:Date,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    }
})


const noteadddata=new mongoose.model('noteadddata',noteadd)
module.exports=noteadddata