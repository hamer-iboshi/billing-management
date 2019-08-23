const path = require('path');
const csvjson = require('csvjson');
const Contract = require('../models/Contracts');

module.exports = {
    async store(req, res, next){
        let objContracts = [];
        let objInstallments = [];
        if (req.files.delayed_installments) {
            if (!('contracts' in req.files) && !('delayed_installments' in req.files)) {
                return res.status(400).send('No files were uploaded.');
            }
            if (path.extname(req.files.contracts.name) === '.csv') {
                // open uploaded file
                
                const contracts = csvjson.toObject(req.files.contracts.data.toString());
                for(let i in contracts) {
                    console.log(contracts[i])
                    let contractExists = await Contract.findOne({ _id: contracts[i].external_id });
                    if (contractExists) {
                        objContracts.push(contractExists);
                    } else {
                        const { 
                            external_id : _id, 
                            customer_name,
                            customer_email,
                            customer_cpf,
                            loan_value,
                            payment_term,
                            realty_address
                        } = contracts[i];
                        const objContract = await Contract.create({
                            _id,
                            customer_name,
                            customer_email,
                            customer_cpf,
                            loan_value,
                            payment_term,
                            realty_address
                        });
                        objContracts.push(objContract);
                    }
                }
            } else {
                return res.status(400).send('Error, the file is not csv.');
            }
            return res.send(objContracts);
        }   

        if (req.files.delayed_installments) {
            if (path.extname(req.files.delayed_installments.name) === '.csv') {
                // open uploaded file
                const installments = csvjson.toObject(req.files.contracts.data.toString());
                // console.log(jsonObj);
            } else {
                return res.status(400).send('Error, the file is not csv.');
            }
        }
        return res.send('Files uploaded!',objContracts);
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