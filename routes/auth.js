var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');
var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "bybrisk-d2074.appspot.com"
});
let db = admin.firestore();
var bucket = admin.storage().bucket();

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
    let docRef = db.collection('businessPartners').doc(req.body.email);
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
    let docRef = db.collection('businessPartners').doc(req.query.emailbusiness);
    let bPartnerInfo = docRef.set({
        businessType: req.query.bType,
        businessCategory: req.query.bCat,
        businessCity:req.query.bCity
    },{merge: true});

    res.render('Launch-your-business',
        { title: 'Bybrisk | '+req.query.namebusiness,
            bName: req.query.namebusiness,
            bCityName : req.query.bCity,
            link1:'Basic Info',
            link2:'Getting started',
            link3:'>> Launching',
            link4:'',
            email1:req.query.emailbusiness});
});

/* GET auth page. */
router.post('/homepage',function (req,res,next) {

    //save password to firebase
    let docRef = db.collection('businessPartners').doc(req.body.emailbusiness);
    let bPartnerInfo = docRef.set({
        password: req.body.passwordTxtField
    },{merge: true});

    //initialising item owner mapping store
    let docRef1 = db.collection('businessItemMap').doc(req.body.emailbusiness);
    let bPartnerInfo1 = docRef1.set({
        itemsInStore: '[]'
    });

    //upload to Google Cloud Storage
    var filename1 = req.files.bHoardingPic;
    console.log(filename1.tempFilePath+"\\"+filename1.name);
    filename1.mv('./public/images/businessPartner/'+filename1.name);
    async function uploadFile() {
        // Uploads a local file to the bucket
        await bucket.upload(".\\public\\images\\businessPartner\\"+filename1.name, {
            gzip: true,
            metadata: {
                cacheControl: 'public, max-age=31536000',
            },
        });
    }

    uploadFile().catch(console.error);


    res.render('homepage',
        { title: 'Bybrisk | '+req.body.namebusiness,
            bName: req.body.namebusiness,
            bCityName : req.body.bCity,
            link1:'Basic Info',
            link2:'Getting started',
            link3:'>> Launching',
            link4:'',
            email:req.body.emailbusiness});
});


module.exports = router;
