const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    desc: {
        type: String,
        required: true,
        trim: true
    },
    supplier: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    image: {
        type: String,

    },
    tt: {
        type: Number,
        required: true,
        trim: true,
        default: 1
    }
})

mongoose.model('Product', productSchema);
module.exports = productSchema;