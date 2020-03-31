var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');
var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bybrisk-31f19.firebaseio.com",
    storageBucket: "bybrisk-31f19.appspot.com"
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
        link4:'signin'});
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
            link4:'signin',
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
            link4:'signin',
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
   /** var filename1 = req.files.bHoardingPic;
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

    uploadFile().catch(console.error);**/

    fetchAllItemsAndLoadHomePage(req,res,req.body.emailbusiness,req.body.namebusiness,req.body.bCity);

});

//siginin processflow
router.post('/redirecting',function (req,res,next) {
    let ColRef = db.collection('businessPartners').doc(req.body.emailSignin);
    let getDoc = ColRef.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such document!');
                res.render('oops',
                    { title: 'Bybrisk | Not Found Error',
                        errMsg:'User Not Found!',
                        link1:'Our Services',
                        link2:'Contact',
                        link3:'signin',
                        link4:'',
                        email:req.body.emailSignin});
            } else {
                //console.log('Document data:', doc.data());
                bPartnerObj=doc.data()
                if(doc.data().password==req.body.passwordSignin){

                    fetchAllItemsAndLoadHomePage(req,res,req.body.emailSignin,bPartnerObj.businessName,bPartnerObj.businessCity);
                        }
                else{
                    res.render('oops',
                        { title: 'Bybrisk | Password Error',
                            errMsg:'Password you entered is wrong!',
                            link1:'Our Services',
                            link2:'Contact',
                            link3:'signin',
                            link4:'',
                            email:req.body.emailSignin});
                }

                }

        })
        .catch(err => {
            console.log('Error getting document', err);
            res.render('oops',
                { title: 'Bybrisk | Error',
                    errMsg:'Error fetching document!',
                    link1:'Our Services',
                    link2:'Contact',
                    link3:'signin',
                    link4:'',
                    email:req.body.emailSignin});
        });

});

function fetchAllItemsAndLoadHomePage(req,res,businessEmail,businessName,businessCity){
    //fetch store items for homepage
    var objItemIndividual = new Array();
    var cat1="none";
    var cat2="none";
    var cat3="none";
    var cat4="none";
    var cat5="none";
    var cat6="none";
    var cat7="none";
    var cat8="none";
    let citiesRef = db.collection('storeItems');
    let query = citiesRef.where('businessEmail', '==',businessEmail ).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                res.render('homepage',
                    { title: 'Bybrisk | '+businessName,
                        bName: businessName,
                        bCityName : businessCity,
                        link1:'Your Store',
                        link2:'Profile',
                        link3:'logout',
                        link4:'',
                        email:businessEmail,
                        objItemData:[],
                        emptyErr:'',
                        cat1:cat1,
                        cat2:cat2,
                        cat3:cat3,
                        cat4:cat4,
                        cat5:cat5,
                        cat6:cat6,
                        cat7:cat7,
                        cat8:cat8,
                        nfiEmpty:'Empty',
                        fiEmpty:'Empty'});
            }else {
                snapshot.forEach(doc => {
                    //console.log(doc.id, '=>', doc.data());
                    objItemIndividual.push(doc.data());
                    console.log(doc.data().itemCategory);
                    if(doc.data().itemCategory=="laundryAndDetergents"){
                         cat1 = "block";
                    }
                    if(doc.data().itemCategory=="babyCare"){
                         cat2 = "block";
                    }
                    if(doc.data().itemCategory=="cleaningAndHousehold"){
                         cat3 = "block";
                    }
                    if(doc.data().itemCategory=="beautyAndHygiene"){
                         cat4 = "block";
                    }
                    if(doc.data().itemCategory=="kitchenGardenAndPets"){
                         cat5 = "block";
                    }
                    if(doc.data().itemCategory=="foodgrainsAndMasalas"){
                         cat6 = "block";
                    }
                    if(doc.data().itemCategory=="beverages"){
                         cat7 = "block";
                    }
                    if(doc.data().itemCategory=="fruitsAndVegetables"){
                         cat8 = "block";
                    }
                });
                res.render('homepage',
                    {
                        title: 'Bybrisk | ' + businessName,
                        bName: businessName,
                        bCityName: businessCity,
                        link1: 'Your Store',
                        link2: 'Profile',
                        link3: 'logout',
                        link4: '',
                        email: businessEmail,
                        objItemData: objItemIndividual,
                        emptyErr: '',
                        cat1:cat1,
                        cat2:cat2,
                        cat3:cat3,
                        cat4:cat4,
                        cat5:cat5,
                        cat6:cat6,
                        cat7:cat7,
                        cat8:cat8,
                        nfiEmpty:'',
                        fiEmpty:''
                    });
            }
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
}

module.exports = router;
