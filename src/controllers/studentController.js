const createHttpError = require('http-errors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require('dotenv').config();
const Student = require('../model/student');
const jwt  = require('jsonwebtoken')
const bcrypt = require('bcryptjs')




exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        if (!email || !password) {
            throw createHttpError(400, "missing email or password")
        }
        try {
            var user = await Student.findByCredentials(req.body.email, req.body.password)
        } catch (error) {
            throw createHttpError(400, "Admin not found ")
        }

        const token = await user.generateAuthToken()
        res.send({ user, token })

    } catch (error) {
        next(error)
    }
};


exports.forgotPassword = async (req, res, next) => {


    const email = req.body.email
    if (!email) {
        throw createHttpError(400, "missing email address")
    }

    const password  = process.env.PASSWORD
    const Sendmail = process.env.EMAIL
    try {
        const student = await Student.findOne({ email: email })
        var userId = student._id;
        if (!student) {
            throw createHttpError(400, "missing student ")
        }

        const token = await student.generateAuthToken()

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: Sendmail,
              pass: password
            }
          });
          
          var mailOptions = {
            from: Sendmail,
            to: 'salindalakshan99@gmail.com',
            subject: 'Sending Email using Node.js',
            text: `http://localhost:3000/ResetPassword/${userId}/${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });


        res.send({token, userId})


    } catch (error) {
        next(error)
    }
};
// Controller function
exports.create = async (req, res, next) => {

    const { firstName, email, password } = req.body;
    try {

        //const email1 =  await Student.login(email);

        const { profile } = req.files;
        console.log("profile");
        if (!profile) {
            throw createHttpError(404, "image not found");
        }
        if (!profile.mimetype.startsWith('image')) {
            throw createHttpError(400, 'Only images are allowed');
        }

        const filepath = __dirname + '/../../public/profiles/' + profile.name; // Adjusted path
        profile.mv(filepath);

        const fileUploadPath = "/public/profiles/" + profile.name;

        if (!firstName || !email || !password) {
            throw createHttpError(400, "please provide all required information");
        }

        const student = new Student({
            firstName,
            email,
            password,
            profile: fileUploadPath,
        });

        const result = await student.save();
        res.status(201).send(result);
    } catch (error) {
        next(error);
    }
};

exports.resetPassword  = async(req, res,next)=> {
       const {id ,token} = req.params
       const newPassword = req.body.password


       const verify = jwt.verify(token,"mysecret") 

       if(verify) {

        hasspasword = await bcrypt.hash(newPassword, 12)
      
        const user = await   Student.findByIdAndUpdate({_id: id},{password: hasspasword})

        console.log(user)
        res.send("success")
        

       }

};

