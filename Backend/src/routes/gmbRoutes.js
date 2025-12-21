const express = require('express');
const router = express.Router();
const validator = require('../middleware/validator')
const gmbController = require("../controllers/gmbController");

// to show form
router.get('/',gmbController.Home);

// submit the link
router.post('/analyze',validator.validateGMB,gmbController.analyzeGMB);

// get all pdfs
router.get('/pdfs',gmbController.getAllPdfs)

module.exports = router;