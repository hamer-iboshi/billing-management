const express = require('express');
const ContractController = require('./controllers/ContractController');
const BankSlip = require('./controllers/BankSlipController');
const routes = express.Router();

routes.get('/',ContractController.index);
routes.post('/',ContractController.store);
routes.get('/:contractId/contract',ContractController.show);
routes.post('/:contractId/schedule',BankSlip.store);
routes.post('/:contractId/destroy',ContractController.destroy);
routes.post('/:bankSlipId/payment',BankSlip.bankSlipsPayment);

module.exports = routes;