
const createHttpError = require('http-errors');


require('dotenv').config();
const Vehicle = require('../model/vehicle');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const path = require('path');
const fs = require('fs');

const { google } = require('googleapis');
const { version } = require('os');




//Crete new Admin  Controller function
exports.create = async (req, res, next) => {

    const CLIENT_ID = process.env.CLIENT_ID
    const CLIENT_SECRET = process.env.CLIENT_SECRET
    const REDIRECT_URL = process.env.REDIRECT_URL
    const REFRESH_TOKEN =process.env.REFRESH_TOKEN


    const { 
        vehicleId,
        chassisNumber,
        engineNo,
        companyName,
        numberOfDoors,
        color,
        seatingCapacity,
        condition,
        engineDisplacement,
        fuelType,
        manufacturedCountry,
        assembled,
        vehicleType,
        brand,
        




        
        } = req.body;  
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
