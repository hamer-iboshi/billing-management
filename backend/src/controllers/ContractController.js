const path = require('path');
const csvjson = require('csvjson');
const Contract = require('../models/Contracts');
const DelayedInstallments = require('../models/DelayedInstallments');

module.exports = {
    async store(req, res, next){
        let objContracts = [];
        let objDInstallments = [];
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
        }   
        if (req.files.delayed_installments) {
            console.log(req.files.delayed_installments);
            if (path.extname(req.files.delayed_installments.name) === '.csv') {
                // open uploaded file
                const delayed_installments = csvjson.toObject(req.files.delayed_installments.data.toString());
                for(let i in delayed_installments) {
                    console.log(delayed_installments[i])
                    let contractExists = await Contract.findOne({ _id: delayed_installments[i]['contract_id'] });
                    if (!contractExists) {
                        objDInstallments.push({
                            'installment_index': delayed_installments[i]['installment_index'],
                            'error' : 'Contract_id not found'
                        });
                    } else {
                        let installmentExists = await DelayedInstallments.findOne({ installment_index: delayed_installments[i]['installment_index'] });
                        if (installmentExists) {
                            objDInstallments.push(installmentExists);
                        } else {
                            console.log("teste",delayed_installments[i]);
                            const objDInstallment = await DelayedInstallments.create({
                                'contract_id': contractExists._id,
                                'installment_index': delayed_installments[i]['installment_index'],
                                'due_date': delayed_installments[i]['due_date'],
                                'value': delayed_installments[i]['value']
                            });
                            objDInstallments.push(objDInstallment);
                        }
                    }
                }
            } else {
                return res.status(400).send('Error, the file is not csv.');
            }
        }
        return res.send('Files uploaded!',objContracts, objDInstallments);
    }
};