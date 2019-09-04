const { Schema, model } = require('mongoose');

const DelayedInstallmentSchema = new Schema({
    contract_id: {
        type: String,
        ref: 'Contract',
        required: true
    }, 
    installment_index: {
        type: String,
        required: true
    }, 
    due_date: {
        type: Date,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
},{
    timestamps: true,
});

module.exports = model('DelayedInstallment', DelayedInstallmentSchema);