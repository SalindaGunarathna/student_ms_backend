require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json());   
const createHttpError = require('http-errors')
const fileUpload = require('express-fileupload');

app.use(fileUpload());  
const Student  = require('./routers/student')

app.use('/api/v1/',Student);


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