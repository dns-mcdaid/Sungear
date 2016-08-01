var express = require('express');
var router = express.Router();

const dataTest = require('../public/javascripts/test/dataTest');
const VisGene = require('../public/javascripts/backend/visGeneServer');

/* GET home page. */
router.get('/', function(req, res, next) {
    var args = [ "--version", "-data_dir", "data/" ];
    VisGene.main(args).then(function(result) {
        res.render('index', { title: 'Sungear', incoming: result.exp });
    });
});

module.exports = router;