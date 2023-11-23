const mongoose  = require("mongoose")
require('dotenv').config();
const port = process.env.PORT
const path = process.env.MONGO_URI

const app = require('./app')

mongoose.connect(path,{}).then(result =>{  
    console.log("data base connected ")

    app.listen(port, ()=>{
        console.log('listening on port ' + port)
    })
}).catch(err => console.log(err));
