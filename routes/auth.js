var express = require('express');
var router = express.Router();

/* GET auth page. */
router.get('/', function(req, res, next) {
    res.render('auth',
        { title: 'Bybrisk | Authorization',
          auth: 'business partner',
            link1:'Basic Info',
            link2:'Getting started',
        link3:'Launching',
        link4:''});
});


module.exports = router;
