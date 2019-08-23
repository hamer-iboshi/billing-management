const path = require('path');
const express = require('express');
const ContractController = require('./controllers/ContractController');
const DelayedInstallment = require('./controllers/DelayedInstallmentController');
const multer = require('multer');
const routes = express.Router();

var storage = multer.memoryStorage();
var upload = multer({ dest: 'uploads/', fileFilter:  (req, file, cb) => {
            if ((file.mimetype) !== 'text/csv') {
                return cb(new Error('Only CSVs are allowed!'))
            }
            cb(null, true)
        }});
routes.post('/',ContractController.store);
// routes.post('/upload',upload.any(),ContractController.store_upload);
routes.post('/upload',upload.single('contracts'),ContractController.store_upload);

module.exports = routes;