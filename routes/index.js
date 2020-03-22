var express = require('express');
var router = express.Router();

/* GET auth page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bybrisk | Login',
  link1:'Our Services',
  link2:'Contact',
    link3:'',
    link4:''});
});


module.exports = router;
