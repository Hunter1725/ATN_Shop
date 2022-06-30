const mongoose = require('mongoose');
// const url = "mongodb://localhost:27017/EmployeeDB";
const url = "mongodb+srv://hunter:admin123@hunter.agp6e.mongodb.net/HunterShopp?retryWrites=true&w=majority"
mongoose.connect(url, { useNewUrlParser: true }, (err) => {
    if (!err) { console.log("MongoDB Connection Succeeded"); } else {
        console.log("An Error Occured");
    }
})

require('./categoryModel');
require('./productModel');
require('./supplierModel');