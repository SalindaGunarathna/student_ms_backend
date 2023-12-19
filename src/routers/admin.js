const express = require('express');
const router = express.Router();

const Admin = require('../controllers/adminController');

router.post('/login',Admin.login);
router.post('/',Admin.create);
router.post('/forgot',Admin.forgotPassword);
router.post('/reset/:id/:token',Admin.resetPassword);


module.exports = router;
