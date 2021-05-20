const mongoose=require('mongoose')
const chalk = require('chalk');

mongoose.connect("mongodb://localhost:27017/password-manager",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log(chalk.green('connection accepted by database and connected succesfully'))
}).catch((err)=>{
    console.log(chalk.red(err))
})