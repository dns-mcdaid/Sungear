var express = require('express');
var router = express.Router();

// var dataTest = require('../public/javascripts/test/dataTest');
// var geneTest = require('../public/javascripts/test/geneTest');
var hyperTest = require('../public/javascripts/test/HyperGeoTest');

/* GET home page. */
router.get('/', function(req, res, next) {
    hyperTest.test();
    res.render('index', { title: 'Sungear' });
});

module.exports = router;