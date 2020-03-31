var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');

let db = admin.firestore();

/* GET auth page. */
router.post('/itemUpload', function(req, res, next) {
    let docRef = db.collection('businessPartners').doc(req.body.emailbusiness);
    let bPartnerInfo = docRef.set({
        bybriskStore: 'Active',
    },{merge: true});
    res.render('add-item-to-your-store', { title: 'Bybrisk | Add Item to Store',
        bName:req.body.businessName,
        bCity:req.body.businessCity,
        email:req.body.emailbusiness,
        link1:'Your store',
        link2:'Profile',
        link3:'logout',
        link4:''});
});

router.post('/back-to-store', function(req, res, next) {
    let docRef = db.collection('businessPartners').doc(req.body.emailbusiness);
    let bPartnerInfo = docRef.set({
        bybriskStore: 'Inactive',
    },{merge: true});

    //fetch all items and load homepage
    fetchAllItemsAndLoadHomePage(req,res,req.body.emailbusiness,req.body.businessName,req.body.businessCity);
});

router.get('/itemInfoAdded', function(req, res, next) {

    let addDoc = db.collection('storeItems').add({
        businessName: req.query.businessName,
        businessEmail: req.query.emailbusiness,
        itemCategory:req.query.itemCatSelect,
        itemName:req.query.commodityNameInput,
        itemBrand:req.query.commodityBrandInput,
        itemPrice:req.query.commodityPriceInput,
        itemQuantity:req.query.commodityQuantityInput
    }).then(ref => {
        console.log('Added document with ID: ', ref.id);
        let docRef1 = db.collection('businessItemMap').doc(req.query.emailbusiness);
        let bPartnerInfo1 = docRef1.update({
            itemsInStore: admin.firestore.FieldValue.arrayUnion(ref.id)
        });
        res.render('postItemImg', { title: 'Bybrisk | Add Item to Store',
            bName:req.query.businessName,
            bCity:req.query.businessCity,
            email:req.query.emailbusiness,
            refItemId : ref.id,
            link1:'Your store',
            link2:'Profile',
            link3:'logout',
            link4:''});
    });

    //fetchAllItemsAndLoadHomePage(req,res,req.body.emailbusiness,req.body.businessName,req.body.businessCity);


});

router.get('/itemPicAdded', function(req, res, next) {
    //fetch all items and load homepage
    var bucket = admin.storage().bucket();
    const file = bucket.file('images/itemPic/'+req.query.refItemId+'.jpg');
    file.makePublic().then(function(data) {
        const apiResponse = data[0];
    }).catch(err => {
        console.log('Error getting image : ', err);
    });

    let docRef = db.collection('storeItems').doc(req.query.refItemId);
    let bPartnerInfo = docRef.set({
        itemPicURL: req.query.refItemId,
    },{merge: true});

    fetchAllItemsAndLoadHomePage(req,res,req.query.emailbusiness,req.query.businessName,req.query.businessCity);
});

router.get('/categoryItem', function(req, res, next) {
    //fetch all items and load Category page
    fetchAllItemsAndLoadCategoryPage(req,res,req.query.emailbusiness,req.query.businessName,req.query.businessCity,req.query.itemCat);
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

function fetchAllItemsAndLoadCategoryPage(req,res,businessEmail,businessName,businessCity,itemCategory){
    //fetch store items for homepage
    var objItemIndividual = new Array();
    let citiesRef = db.collection('storeItems');
    let query = citiesRef.where('businessEmail', '==',businessEmail ).where('itemCategory','==',itemCategory).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                res.render('itemCategory',
                    { title: 'Bybrisk | '+businessName,
                        bName: businessName,
                        bCityName : businessCity,
                        link1:'Your Store',
                        link2:'Profile',
                        link3:'logout',
                        link4:'',
                        email:businessEmail,
                        objItemData:[],
                        emptyErr:'No Item in the Store'});
            }else {
                snapshot.forEach(doc => {
                    //console.log(doc.id, '=>', doc.data());
                    objItemIndividual.push(doc.data());
                    console.log(doc.data().itemCategory);
                });
                res.render('itemCategory',
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
                        emptyErr: ''
                    });
            }
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
}
module.exports = router;
