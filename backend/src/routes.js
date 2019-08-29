const express = require('express');
const ContractController = require('./controllers/ContractController');
const DelayedInstallment = require('./controllers/DelayedInstallmentController');
const BankSlip = require('./controllers/BankSlipController');
const routes = express.Router();

routes.get('/',ContractController.index);
routes.post('/',ContractController.store);
routes.get('/:contractId/contract',ContractController.show);
routes.get('/:contractId/schedule',BankSlip.store);
routes.post('/:contractId/destroy',ContractController.destroy);

module.exports = routes;