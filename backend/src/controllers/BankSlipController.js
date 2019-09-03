const BankSlips = require('../models/BankSlips');
const DelayedInstallments = require('../models/DelayedInstallments');

module.exports = {

    async store(req, res){
        const { installments, fee_value, interest_value, due_date, contract_id } = req.body;
        dueDate = new Date(due_date);
        if ( (dueDate.getTime() + 1000 * 3600 * 24) <= new Date() ) {
            return res.status(400).send('Date is not greater than today.');
        }
        let sum_delayed_installments = 0.0;
        let value = 0.0;
        let installmentsId = [];
        installments.forEach(element => {
            installmentsId.push(element.delayed_installment._id);
            sum_delayed_installments = sum_delayed_installments + element.delayed_installment.value;
            value = value + element.delayed_installment.value * (Math.pow(Number(interest_value) + 0.01, element.days_in_delay));
        });
        value += sum_delayed_installments + sum_delayed_installments*(fee_value/100);
        if (value < sum_delayed_installments) {
            return res.status(400).send('Value is smaller than the sum of selected installments.');
        }
        const bank_slip = await BankSlips.create({
            'contract_id' : contract_id,
            'due_date' : dueDate,
            'value' : value.toFixed(2),
            'status' : 'pending',
            'installments' : installmentsId
        });
        return res.json(bank_slip);
    },

    async bankSlipsPayment(req, res){
        const { bankSlipId } = req.params;
        bankSlip = await BankSlips.findOne({ '_id' : bankSlipId});
        bankSlip.installments.forEach(installmentId => {
            let response = DelayedInstallments.findOne({ '_id' : installmentId}).deleteOne();
            console.log(response);
        });
        bankSlip.status = 'paid';
        bankSlip.save();
        res.json(bankSlip);
    }
}