const express = require('express');
const mongoose = require('mongoose');
const Supplier = mongoose.model('Supplier');
const router = express.Router();

router.get("/addSupplier", (req, res) => {
    res.render("supplier/addOrEditSupplier", {
        viewTitle: "Insert Supplier"
    })
})

router.post("/addSupplier", (req, res) => {
    if (req.body._id == "") {
        insertRecord(req, res);
    } else {
        updateRecord(req, res);
    }
})

function insertRecord(req, res) {
    var supplier = new Supplier();
    supplier.title = req.body.title;
    supplier.email = req.body.email;
    supplier.address = req.body.address;
    supplier.phone = req.body.phone;


    supplier.save((err, doc) => {
        if (!err) {
            res.redirect('/suppliers/');
        } else {
            if (err.name == "ValidationError") {
                handleValidationError(err, req.body);
                res.render("supplier/addOrEditSupplier", {
                    viewTitle: "Insert Supplier",
                    supplier: req.body
                })
            }
            console.log("Error occured during record insertion" + err);
        }
    })
}

function updateRecord(req, res) {
    Supplier.findOneAndUpdate({ _id: req.body._id, }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('/suppliers/');
        } else {
            if (err.name == "ValidationError") {
                handleValidationError(err, req.body);
                res.render("category/addOrEditCategory", {
                    viewTitle: 'Update Category',
                    supplier: req.body
                });
            } else {
                console.log("Error occured in Updating the records" + err);
            }
        }
    })
}

router.get('/', (req, res) => {
    Supplier.find((err, docs) => {
        if (!err) {
            res.render("supplier/indexSupplier", {
                list: docs
            })
        }
    })
})

router.get('/:id', (req, res) => {
    Supplier.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("supplier/addOrEditSupplier", {
                viewTitle: "Update Supplier",
                supplier: doc
            })
        }
    })
})

router.post('/search', (req, res) => {
    Supplier.find({ title: req.body.search }, (err, doc) => {
        if (!err) {
            res.render("supplier/indexSupplier", {
                list: doc
            })
        }
    })
})

router.get('/delete/:id', (req, res) => {
    Supplier.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/suppliers/');
        } else {
            console.log("An error occured during the Delete Process" + err);
        }
    })
})

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'title':
                body['titleError'] = err.errors[field].message;
                break;

            case 'email':
                body['emailError'] = err.errors[field].message;
                break;

            default:
                break;
        }
    }
}

module.exports = router;