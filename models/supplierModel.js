const mongoose = require('mongoose');
var validator = require("email-validator");

var supplierSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'This field is required',
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    }
})

// custom validation for email

supplierSchema.path('email').validate((val) => {
    return validator.validate(val);
}, 'Invalid Email');

mongoose.model('Supplier', supplierSchema);
module.exports = supplierSchema;