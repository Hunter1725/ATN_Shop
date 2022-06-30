const express = require('express');
const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const router = express.Router();

router.get("/addCategory", (req, res) => {
    res.render("category/addOrEditCategory", {
        viewTitle: "Insert Category"
    })
})

router.post("/addCategory", (req, res) => {
    if (req.body._id == "") {
        insertRecord(req, res);
    } else {
        updateRecord(req, res);
    }
})

function insertRecord(req, res) {
    var category = new Category();
    category.title = req.body.title;
    category.desc = req.body.desc;

    category.save((err, doc) => {
        if (!err) {
            res.redirect('/categories/');
        } else {
            if (err.name == "ValidationError") {
                handleValidationError(err, req.body);
                res.render("category/addOrEditCategory", {
                    viewTitle: "Insert Category",
                    category: req.body
                })
            }
            console.log("Error occured during record insertion" + err);
        }
    })
}

function updateRecord(req, res) {
    Category.findOneAndUpdate({ _id: req.body._id, }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('/categories/');
        } else {
            if (err.name == "ValidationError") {
                handleValidationError(err, req.body);
                res.render("category/addOrEditCategory", {
                    viewTitle: 'Update Category',
                    category: req.body
                });
            } else {
                console.log("Error occured in Updating the records" + err);
            }
        }
    })
}

router.get('/', (req, res) => {
    Category.find((err, docs) => {
        if (!err) {
            res.render("category/indexCategory", {
                list: docs
            })
        }
    })
})

router.get('/:id', (req, res) => {
    Category.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("category/addOrEditCategory", {
                viewTitle: "Update Category",
                category: doc
            })
        }
    })
})

router.post('/search', (req, res) => {
    Category.find({ title: req.body.search }, (err, doc) => {
        if (!err) {
            res.render("category/indexCategory", {
                list: doc
            })
        }
    })
})

router.get('/delete/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/categories/');
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

            case 'desc':
                body['descError'] = err.errors[field].message;
                break;

            default:
                break;
        }
    }
}

module.exports = router;