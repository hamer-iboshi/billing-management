const Contract = require('../models/Contracts');
const fs = require('fs');
const csv = require('fast-csv');

const contracts = [], installments = [];


module.exports = {
    async store(req, res, next){
        if (!('contracts' in req.files) && !('delayed_installments' in req.files)) {
            return res.status(400).send('No files were uploaded.');
        }
        // open uploaded file
        csv.parseFile(req.files.contracts.name)
        .on("data", function (data) {
            contracts.push(data); // push each row
        })
        .on("end", function () {
            console.log(contracts)
            // fs.unlinkSync(req.file.path);   // remove temp file
            //process "fileRows" and respond
        });
        
        return res.send('File uploaded!');
    },
    
    async store_upload(req, res, next){
        console.log(req.files)
        console.log(req.body)
        return res.send('File uploaded!');
    }
};