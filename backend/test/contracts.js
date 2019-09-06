let mongoose = require("mongoose");
const path = require('path');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Contracts = require('../src/models/Contracts');
const DelayedInstallments = require('../src/models/DelayedInstallments');
const BankSlip = require('../src/models/BankSlips');
const server = require('../src/server');
const fs = require('fs');

const should = chai.should();
const assert = chai.assert;

chai.use(chaiHttp);

describe('Contract and Delayed Installments', () => {
    //begin with a clean test_db
    beforeEach((done) => { 
        Contracts.remove({});
        DelayedInstallments.remove({});
        BankSlip.remove({});
        done();
    });

    describe('Tests of contract, delayed installments and bank slips operations', () => {
        let contract = {};
        let bank_slip_id = '';
        it('should get all contracts', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    should.exist(res.body);
                    res.should.have.status(200);
                    res.should.be.a('object');
                    done();
                });
        });

        it('should return no files were uploaded', (done) => {
            chai.request(server)
                .post('/')
                .end((err, res) => {
                    res.should.have.status(400);
                    assert.equal(res.body.message, 'No files were uploaded.');
                    done();
                });
        });

        it('should return the contract file is not csv', (done) => {
            chai.request(server)
                .post('/')
                .attach('contracts', fs.readFileSync(path.resolve(__dirname,'favicon.ico')),'favicon.ico')
                .end((err, res) => {
                    res.should.have.status(400);
                    assert.equal(res.body.message, 'Error, the contract file is not csv.');
                    done();
                });
        });
        
        it('should return the delayed installment file is not csv', (done) => {
            chai.request(server)
                .post('/')
                .attach('delayed_installments', fs.readFileSync(path.resolve(__dirname,'favicon.ico')),'favicon.ico')
                .end((err, res) => {
                    res.should.have.status(400);
                    assert.equal(res.body.message, 'Error, the delayed installment file is not csv.');
                    done();
                });
        });

        it('should upload contract file and store contracts', (done) => {
            chai.request(server)
                .post('/')
                .attach('contracts', fs.readFileSync(path.resolve(__dirname,'contracts.csv')),'contracts.csv')
                .end((err, res) => {
                    should.exist(res.body);
                    res.should.have.status(200);
                    res.should.be.a('object');
                    assert.equal(res.body.message, 'Files uploaded!')
                    contract = res.body.contracts[0];
                    done();
                });
        });

        it('should upload delayed installments file and store contracts', (done) => {
            chai.request(server)
                .post('/')
                .attach('delayed_installments', fs.readFileSync(path.resolve(__dirname,'delayed_installments.csv')),'delayed_installments.csv')
                .end((err, res) => {
                    should.exist(res.body);
                    res.should.have.status(200);
                    res.should.be.a('object');
                    assert.equal(res.body.message, 'Files uploaded!')
                    done();
                });
        }).timeout(5000);

        it('should list contract detail, delayed installment and bank slips', (done) => {
            chai.request(server)
                .get(`/${contract._id}/contract`)
                .end((err, res) => {
                    should.exist(res.body);
                    res.should.have.status(200);
                    res.should.be.a('object');
                    res.body.should.have.property('contract')
                    res.body.should.have.property('delayed_installments')
                    res.body.should.have.property('bank_slips')
                    done();
                });
        });

        it('should schedule a bank slip', async function() {
            let delayed_installment = await DelayedInstallments.findOne({ 'contract_id': contract._id });
            let selectedDelayedInstallments = { 
                'delayed_installment': delayed_installment,
                'days_in_delay' : 5
            };
            chai.request(server)
                .post(`/${contract._id}/schedule`)
                .send({
                    'installments' : [ selectedDelayedInstallments ],
                    'fee_value' : 5,
                    'interest_value' : 1,
                    'due_date' : new Date((new Date().getTime()) + 1000 * 3600 * 24),
                    'contract_id' : contract._id
                  })
                .end((err, res) => {
                    bank_slip_id = res.body.bank_slip._id;
                    should.exist(res.body);
                    res.should.have.status(200);
                    res.should.be.a('object');
                });
        }).timeout(1000);
        
        it('should remove contract', (done) => {
            chai.request(server)
                .post(`/${contract._id}/destroy`)
                .end((err, res) => {
                    should.exist(res.body);
                    res.should.have.status(200);
                    assert.equal(res.body.message, 'Contract removed!')
                    done();
                });
        });
        
    });

});