var express = require('express');
var router = express.Router();

// var hyperTest = require('../public/javascripts/test/HyperGeoTest');

/* GET home page. */
router.get('/', function(req, res, next) {
    // hyperTest.test();
    res.render('index', { title: 'Sungear' });
});

module.exports = router;