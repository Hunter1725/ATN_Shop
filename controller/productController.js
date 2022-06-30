const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = mongoose.model('Product');
const Category = mongoose.model('Category');
const Supplier = mongoose.model('Supplier');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images');
    },
    filename: function(req, file, cb) {
        cb(null, req.body.name + '-' + Date.now() + path.extname(file.originalname));
    }
})
var upload = multer({
    storage: storage
});

router.get("/addProduct", (req, res) => {
    Supplier.find(function(err, suppliers) {
        Category.find(function(err, categories) {
            res.render("product/addOrEditProduct", {
                viewTitle: "Insert Product",
                suppliers: suppliers,
                categories: categories
            })
        })
    })
})

router.post("/addProduct", upload.single('avatar'), (req, res) => {
    if (req.body._id == "") {
        insertRecord(req, res);
    } else {
        updateRecord(req, res);
    }
})

function insertRecord(req, res) {
    var product = new Product();
    var avatar = req.query.img;
    product.title = req.body.title;
    product.desc = req.body.desc;
    product.supplier = req.body.supplier;
    product.category = req.body.category;
    product.price = req.body.price;
    product.image = req.file.originalname;
    product.tt = req.body.tt;
    // fs.unlinkSync(__dirname + "/public/images/" + avatar);
    product.save((err, doc) => {
        if (!err) {
            res.redirect('/products/');
        } else {
            if (err.name == "ValidationError") {
                handleValidationError(err, req.body);
                res.render("product/addOrEditProduct", {
                    viewTitle: "Insert Product",
                    product: req.body
                })
            }
            console.log("Error occured during record insertion" + err);
        }
    })
}

function updateRecord(req, res) {
    Product.findById({ _id: req.body._id }, function(err, p) {
        p.title = req.body.title;
        p.desc = req.body.desc;
        p.supplier = req.body.supplier;
        p.category = req.body.category;
        p.price = req.body.price;
        p.image = req.file.originalname;
        p.tt = req.body.tt;
        p.save(function(err) {
            if (err) console.log(err);
            res.redirect('/products/');
        });
    })
}

router.get('/', (req, res) => {
    Product.find((err, docs) => {
        if (!err) {
            res.render("product/indexProduct", {
                list: docs
            })
        }
    })
})

router.get('/:id', (req, res) => {
    Product.findById(req.params.id, (err, doc) => {
        if (!err) {
            Supplier.find(function(err, suppliers) {
                Category.find(function(err, categories) {
                    res.render("product/addOrEditProduct", {
                        viewTitle: "Update Product",
                        suppliers: suppliers,
                        categories: categories,
                        product: doc
                    })
                })
            })
        }
    })
})

router.post('/search', (req, res) => {
    Product.find({ title: req.body.search }, (err, doc) => {
        if (!err) {
            res.render("product/indexProduct", {
                list: doc
            })
        }
    })
})

router.get('/delete/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/products/');
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
                body['imageError'] = err.errors[field].message;
                break;

            default:
                break;
        }
    }
}

module.exports = router;