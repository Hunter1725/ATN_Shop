const mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'This field is required',
        trim: true
    },
    desc: {
        type: String,
        trim: true
    },
})

mongoose.model('Category', categorySchema);
module.exports = categorySchema;