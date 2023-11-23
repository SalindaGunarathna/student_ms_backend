const createHttpError = require('http-errors');
const Student = require('../model/student');
const mongoose = require('mongoose');




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

