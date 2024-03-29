const path = require('path');
const csvjson = require('csvjson');
const Contract = require('../models/Contracts');
const DelayedInstallments = require('../models/DelayedInstallments');
const BankSlips = require('../models/BankSlips');

module.exports = {
    
    async index(req, res){
        let contracts = await Contract.find({},'-delayed_installments');
        res.json(contracts);
    },

    async store(req, res){
        let objContracts = [];
        let objDInstallments = [];
        //Check input names
        if (req.files==null || !('contracts' in req.files) && !('delayed_installments' in req.files)) {
            return res.status(400).send({ 'message' : 'No files were uploaded.'});
        }
        if(req.files.contracts){
            //Check file extesion of contracts field
            if (path.extname(req.files.contracts.name) === '.csv') {
                //Convert csv to json file
                let contracts = csvjson.toObject(req.files.contracts.data.toString());
                for (let i in contracts) {
                    // Check if the contract already exists
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
                        //Insert contract
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
                return res.status(400).send({ 'message' : 'Error, the contract file is not csv.'});
            }
        }
        if(req.files.delayed_installments){
            //Check file extesion of delayed_installment field
            if (path.extname(req.files.delayed_installments.name) === '.csv') {
                //Convert csv to json file
                let delayed_installments = csvjson.toObject(req.files.delayed_installments.data.toString());
                for (let i in delayed_installments) {
                    //Check if the contract in the delayed_installment exists
                    let DIContractExists = await Contract.findOne({ _id: delayed_installments[i]['contract_id'] });
                    if (!DIContractExists) {
                        objDInstallments.push({
                            'installment_index': delayed_installments[i]['installment_index'],
                            'error' : 'Contract_id not found'
                        });
                    } else {
                        // Check if the delayed_installment already exists
                        let installmentExists = await DelayedInstallments.findOne({ installment_index: delayed_installments[i]['installment_index'] });
                        if (installmentExists) {
                            objDInstallments.push(installmentExists);
                        } else {
                            //Insert delayed_installment
                            const objDInstallment = await DelayedInstallments.create({
                                'contract_id': DIContractExists._id,
                                'installment_index': delayed_installments[i]['installment_index'],
                                'due_date': delayed_installments[i]['due_date'],
                                'value': delayed_installments[i]['value']
                            });
                            //Insert delayed_installment reference in contract
                            DIContractExists.delayed_installments.push(objDInstallment._id);
                            DIContractExists.save();
                            objDInstallments.push(objDInstallment);
                        }
                    }
                }
            } else {
                return res.status(400).send({ 'message' : 'Error, the delayed installment file is not csv.'});
            }
        }
        // return the existent or inserted data
        return res.send({
            'message': 'Files uploaded!',
            'contracts': objContracts, 
            'delayed_installments': objDInstallments
        });
    },

    async show(req, res){
        const { contractId } = req.params;
        let contract = await Contract.findOne({_id : contractId});
        let delayed_installments = [];
        let today = new Date();
        await DelayedInstallments.find({contract_id : contract._id}, function(err, inst){
            inst.forEach(function(item){
                let due_date = new Date(item.due_date);
                let days_in_delay = new Date(today.getTime() - due_date.getTime())
                delayed_installments.push({
                    'delayed_installment' : item, 
                    'days_in_delay' : Math.trunc(days_in_delay.getTime() / (1000 * 3600 * 24))
                });    
            });
        });
        let bank_slips = await BankSlips.find({contract_id : contract._id});
        res.json({
            'contract' : contract, 
            'delayed_installments' : delayed_installments, 
            'bank_slips' : bank_slips
        });
    },

    async destroy(req, res){
        const { contractId } = req.params;   
        let contract = await Contract.findOne({ '_id' : contractId});
        let installments = await DelayedInstallments.deleteMany({ 'contract_id' : contractId });
        let bank_slips = await BankSlips.deleteMany({ 'contract_id' : contractId });
        contract.deleteOne();
        res.send({'message': "Contract removed!"});
    }
};