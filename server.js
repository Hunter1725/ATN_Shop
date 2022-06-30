require('./models/database');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(bodyParser.json());
app.set('views', path.join(__dirname, '/views/'))
app.use(express.static(__dirname + '/public'));
app.engine('hbs', expressHandlebars({
    extname: 'hbs',
    defaultLayout: 'mainLayout',
    layoutsDir: __dirname + '/views/layouts/',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}))
app.set('view engine', 'hbs');


//set routes

var products = require('./controller/productController.js');
var suppliers = require('./controller/supplierController.js');
var categories = require('./controller/categoryController.js');

app.use('/products', products);
app.use('/suppliers', suppliers);
app.use('/categories', categories);
app.use('/', function(req, res) {
    res.render('./main.hbs')
})


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Server is listening on Port 3000");
})