const express = require('express');
const router = express.Router();

const Student = require('../controllers/studentController');

router.post('/login',Student.login);
router.post('/',Student.create);
router.post('/forgot',Student.forgotPassword);


module.exports = router;
