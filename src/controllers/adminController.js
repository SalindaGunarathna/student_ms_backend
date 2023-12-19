const createHttpError = require('http-errors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('../model/admin');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const path = require('path');
const fs = require('fs');

const { google } = require('googleapis');
const { version } = require('os');




exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        if (!email || !password) {
            throw createHttpError(400, "missing email or password")
        }
        try {
            var admin = await Admin.findByCredentials(req.body.email, req.body.password)
        } catch (error) {
            throw createHttpError(400, "Admin not found ")
        }

        const token = await admin.generateAuthToken()
        res.send({ admin, token })

    } catch (error) {
        next(error)
    }
};


exports.forgotPassword = async (req, res, next) => {


    const email = req.body.email
    if (!email) {
        throw createHttpError(400, "missing email address")
    }

    const password = process.env.PASSWORD
    const Sendmail = process.env.EMAIL
    try {
        const admin = await Admin.findOne({ email: email })
        var userId = admin._id;
        if (!admin) {
            throw createHttpError(400, "missing admin ")
        }

        const token = await admin.generateAuthToken()

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

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });


        res.send({ token, userId })


    } catch (error) {
        next(error)
    }
};

exports.resetPassword = async (req, res, next) => {
    const { id, token } = req.params
    const newPassword = req.body.password


    const verify = jwt.verify(token, "mysecret")

    if (verify) {

        hasspasword = await bcrypt.hash(newPassword, 12)

        const user = await Admin.findByIdAndUpdate({ _id: id }, { password: hasspasword })

        console.log(user)
        res.send("success")


    }

};


//Crete new Admin  Controller function
exports.create = async (req, res, next) => {

    const CLIENT_ID = process.env.CLIENT_ID
    const CLIENT_SECRET = process.env.CLIENT_SECRET
    const REDIRECT_URL = process.env.REDIRECT_URL

    const REFRESH_TOKEN =process.env.REFRESH_TOKEN


    const { firstName, email, password } = req.body;  
    try {
        if (!firstName || !email || !password) {
            throw createHttpError(400, "please provide all required information");
        }
        const { profile } = req.files; 
        
        // Authenticate google API 
        const oauth2client = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URL
        )
        
        // create temper local storage file path for profile 
        let filepath = __dirname + "../../../public/profile/" + profile.name


        console.log(filepath)
        profile.mv(filepath) // save profile local location

        if (!profile) {
            throw createHttpError(404, "image not found");
        }
        if (!profile.mimetype.startsWith('image')) {
            throw createHttpError(400, 'Only images are allowed');  
        }

        
        // Authenticate client 
        const drive = google.drive({
            version: 'v3',
            auth: oauth2client
        })

        oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN })
        // save profile in drive storage
        const response = await drive.files.create({
            requestBody: {
                name: profile.name,
                mimeType: profile.mimetype,
            },
            media: {
                mimeType: profile.mimetype,
                body: fs.createReadStream(filepath),
            }
        })
        const fileID = response.data.id
        // get profile url from drive storage
        try {
            const access = await drive.permissions.create({
                fileId: fileID,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                }
            })
            var result_url = await drive.files.get({
                fileId: fileID,
                fields: 'webViewLink'
            })

        } catch (error) {
            next(error)
        }

        
        // set profile Url  path to store in data base 
        const fileUploadPath = result_url.data.webViewLink
        // create new admin
        const admin = new Admin({
            firstName,
            email,
            password,
            profile: fileUploadPath,
            profileID: fileID
        });

        const result = await admin.save();
        res.status(201).send(result);
         
        // delete tem local profile image 
        fs.unlink(filepath, (err) => {
            if (err) {
                console.error("Unable to delete local image file:", err);
            } else {
                console.log("Local image file deleted successfully.");
            }
        });

        

     
    } catch (error) {
        next(error);
    }
};


