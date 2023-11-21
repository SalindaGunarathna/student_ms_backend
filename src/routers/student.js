const express = require('express');
const StudentsController = require('../controllers/studentController')


const router = express.Router()

router.post('/', StudentsController.create);

module.exports = router;   