const { Schema, model } = require('mongoose');

const ContractSchema = new Schema({
    _id: {
        type: String,
        required: true
    }, 
    customer_name: {
        type: String,
        required: true
    }, 
    customer_email: {
        type: String,
        required: true
    },
    customer_cpf: {
        type: String,
        required: true
    },
    loan_value: {
        type: Number,
        required: true
    },
    payment_term: {
        type: Number,
        required: true
    },
    realty_address: {
        type: String,
        required: true
    },
    delayed_installments: [{
        type: Schema.Types.ObjectId,
        ref: 'DelayedInstallment'
    }]
},{
    timestamps: true,
});

module.exports = model('Contract', ContractSchema);