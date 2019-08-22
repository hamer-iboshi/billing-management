const path = require('path');
const express = require('express');
const ContractController = require('./controllers/ContractController');
const DelayedInstallment = require('./controllers/DelayedInstallmentController');
const multer = require('multer');
const routes = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve( __dirname, '..', 'tmp', 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname)
    }
});
var upload = multer({ 
    dest: path.resolve( __dirname, '..', 'tmp', 'uploads'), 
    storage: storage,
    fileFilter:  (req, file, cb) => {
        if (path.extension(file.originalname) !== '.csv') {
            return cb(new Error('Only CSVs are allowed!'))
        }
        cb(null, true)
    }
});

routes.post('/',ContractController.store);
routes.post('/upload',upload.fields([
    { name: 'contracts', maxCount: 1 },
    { name: 'delayed_installments', maxCount: 1 }
]),ContractController.store_upload);

module.exports = routes;