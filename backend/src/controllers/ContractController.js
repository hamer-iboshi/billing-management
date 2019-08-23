const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');
const csvjson = require('csvjson');
const Contract = require('../models/Contracts');

const contracts = [], installments = [];


module.exports = {
    async store(req, res, next){
        if (!('contracts' in req.files) && !('delayed_installments' in req.files)) {
            return res.status(400).send('No files were uploaded.');
        }
        if (path.extname(req.files.contracts.name) === '.csv') {
            // open uploaded file
            // csv.parseFile(req.files.contracts.name)
            // .on("data", function (data) {
            //     contracts.push(data); // push each row
            // })
            // .on("end", function () {
            //     console.log(contracts)
            //     // fs.unlinkSync(req.file.path);   // remove temp file
            //     //process "fileRows" and respond
            // });
        } else {
            return res.status(400).send('Error, the file is not csv.');
        }
        

        if (path.extname(req.files.delayed_installments.name) === '.csv') {
            // open uploaded file
            // csv.parseFile(req.files.delayed_installments.name)
            // .on("data", function (data) {
            //     contracts.push(data); // push each row
            // })
            // .on("end", function () {
            //     console.log(contracts)
            //     // fs.unlinkSync(req.file.path);   // remove temp file
            //     //process "fileRows" and respond
            // });
        } else {
            return res.status(400).send('Error, the file is not csv.');
        }
         
        // req.files.contracts.data.on('data', (chunk) => {
        //     // chunks.push(chunk); // push data chunk to array
        //     console.log(chunk);
        //     // We can perform actions on the partial data we have so far!
        // });
        console.log(req.files.delayed_installments.data)
        // csv.parseStream(req.files.delayed_installments.data).on('error', error => console.error(error)).on('data', row => console.log(row)).on('end', rowCount => console.log(`Parsed ${rowCount} rows`));
        const jsonObj = csvjson.toObject(req.files.delayed_installments.data.toString());
        console.log(jsonObj[0]['contract_id']);
        return res.send('Files uploaded!');
    },
    
    async store_upload(req, res, next){
        console.log(req.files)
        console.log(req.body)
        // csv.parseFile(req.files.contracts.name)
        // .on("data", function (data) {
        //     contracts.push(data); // push each row
        // })
        // .on("end", function () {
        //     console.log(contracts)
        //     // fs.unlinkSync(req.file.path);   // remove temp file
        //     //process "fileRows" and respond
        // });
        return res.send('File uploaded!');
    }
};