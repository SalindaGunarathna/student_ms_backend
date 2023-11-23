const express = require('express');
const router = express.Router();

const Student = require('../controllers/studentController');
router.post('/',Student.create);

module.exports = router;
