const BankSlips = require('../models/BankSlips');
const DelayedInstallments = require('../models/DelayedInstallments');
const Contracts = require('../models/Contracts');
const nodeMailer = require('nodemailer');

module.exports = {

    async store(req, res){
        const { installments, fee_value, interest_value, due_date, contract_id } = req.body;
        let contract = await Contracts.findOne({ '_id' : contract_id });
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
        let transporter = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
        let mailOptions = {
            from: "Payment Bill", // sender address
            to: contract.customer_email, // customer email
            subject: "Bank Slip Info", // Subject line
            html: '<b>Bank Slip Info</b><br>'+"Your bank slip was submited.<br>"+'  contract_id: '+contract_id+'<br>  due_date : '+dueDate+'<br>    value : '+value.toFixed(2) 
            // html body
        };
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
        return res.send({'bank_slip' : bank_slip });
    },

    async bankSlipsPayment(req, res){
        const { bankSlipId } = req.params;
        console.log(bankSlipId);
        bankSlip = await BankSlips.findOne({ '_id' : bankSlipId });
        if (bankSlip.status == 'paid') return res.send('Bank Slip already paid!')
        var response = await DelayedInstallments.deleteMany({ 'contract_id' : bankSlip.contract_id });
        console.log(response);
        bankSlip.status = 'paid';
        bankSlip.save();
        return res.json(bankSlip);
    }
}