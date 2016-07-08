var express = require('express');
var router = express.Router();

var dataTest = require('../public/javascripts/test/dataTest')
var geneTest = require('../public/javascripts/test/geneTest');

/* GET home page. */
router.get('/', function(req, res, next) {
    dataTest.testFile();
    res.render('index', { title: 'Sungear' });
});

module.exports = router;