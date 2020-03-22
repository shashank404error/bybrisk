var express = require('express');
var router = express.Router();

/* GET auth page. */
router.get('/', function(req, res, next) {
    res.render('auth', { title: 'Bybrisk | Login' });
});


module.exports = router;
