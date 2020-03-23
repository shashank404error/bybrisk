var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');
var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore();
/* GET auth page. */
router.get('/', function(req, res, next) {
    res.render('auth',
        { title: 'Bybrisk | Basic Info',
          auth: 'business partner',
            link1:'>> Basic Info',
            link2:'Getting started',
        link3:'Launching',
        link4:''});
});

//processing basic-info of businesses
router.post('/getting-started',function (req,res,next) {
    let docRef = db.collection('users').doc(req.body.email);
    let bPartnerInfo = docRef.set({
        email: req.body.email,
        name: req.body.fName+" "+req.body.lName,
        phoneNum:"+91"+req.body.phoneNum,
        businessName:req.body.bName
    });
    res.render('getting-started',
        { title: 'Bybrisk | Getting Started',
            bName: req.body.bName,
            link1:'Basic Info',
            link2:'>> Getting started',
            link3:'Launching',
            link4:'',
            email:req.body.email});
});

//processing getting-started page info
router.get('/launch-your-business',function (req,res,next) {
    let docRef = db.collection('users').doc(req.query.emailbusiness);
    let bPartnerInfo = docRef.set({
        businessType: req.query.bType,
        businessCategory: req.query.bCat,
        businessCity:req.query.bCity
    },{merge: true});

    res.render('Launch-your-business',
        { title: 'Bybrisk | Launching',
            bName: req.query.namebusiness,
            bCityName : req.query.bCity,
            link1:'Basic Info',
            link2:'Getting started',
            link3:'>> Launching',
            link4:'',
            email:req.body.email});
});



module.exports = router;
