require('dotenv').config()
const express = require('express')
const cors = require('cors'); 
const app = express()
app.use(express.json());    
const createHttpError = require('http-errors')
const fileUpload = require('express-fileupload'); 


app.use(fileUpload());  
app.use(cors());
const Admin  = require('./routers/admin')     

app.use('/api/v1/',Admin);
  

app.use('/public/profiles', express.static('public/profiles'))

app.use ((err,req,res,next) => {
     
   
    if (createHttpError.isHttpError(err)) {
        res.status(err.status).send({massage: err.message});
    }else[
        res.status(500).send({massage: err.message}),
    ]

    // unknown error
     res.status(500).send({massage:"Unknown error"})
})

module.exports  = app