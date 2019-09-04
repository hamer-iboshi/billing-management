const { Schema, model } = require('mongoose');

const BankSlipSchema = new Schema({
    contract_id: {
        type: String,
        ref: 'Contract',
        required: true
    },
    due_date: {
        type: Date,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    installments: [{
        type: Schema.Types.ObjectId,
        ref: 'DelayedInstallment',
        required: true
    }]
},{
    timestamps: true,
});

module.exports = model('BankSlips', BankSlipSchema);