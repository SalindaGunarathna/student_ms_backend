const createHttpError = require('http-errors')
const { body, validationResult } = require('express-validator')
const Student = require('../model/student')
const mongoose = require('mongoose');


 exports.create =

    // body('firstName').notEmpty().withMessage('First name is required'),
    // body('email').isEmail().withMessage('Valid email is required'),
    
     async (req, res, next) => {
        console.log('create');    

        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return next(createHttpError(400, { errors: errors.array() }));
        // }
        const {
            firstName,
            email,
            password,

        } = req.body; 
        try { 


            const { profile } = req.files;
            console.log("profile");  
            if (!profile) {
                throw createHttpError(404, "image not found")
            }
            if (!profile.mimetype.startsWith('image')) {
                throw createHttpError(400, 'Only images are allowed');
            }
            let filepath = __dirname + '../../../public/profiles/' + profile.name
            profile.mv(filepath)

            let fileUploadPath = "/public/profiles/" + profile.name

            if (!firstName || !email || !password) {
                throw createHttpError(400, "please provide all required information");
            }

            const student = new Student(
                {
                    firstName,
                    email,
                    password,
                    profile: fileUploadPath
                }
            );

            const result = await student.save();
            res.status(201).send(result); 


        } catch (error) {  
            next(error);

        }

    }