var express = require('express');
var router = express.Router();

var admin = require('firebase-admin');
var bucket = admin.storage().bucket();

/* GET auth page. */
router.post('/homepage',function (req,res,next) {

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
    { title: 'Bybrisk | '+req.query.namebusiness,
        bName: req.query.namebusiness,
        bCityName : req.query.bCity,
        link1:'Basic Info',
        link2:'Getting started',
        link3:'>> Launching',
        link4:'',
        email:req.body.email});
});


module.exports = router;
