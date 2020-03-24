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
        link1:'Our Services',
        link2:'Contact',
        link3:'',
        link4:''});
});

router.post('/back-to-store', function(req, res, next) {
    let docRef = db.collection('businessPartners').doc(req.body.emailbusiness);
    let bPartnerInfo = docRef.set({
        bybriskStore: 'Inactive',
    },{merge: true});
    res.render('homepage',
        { title: 'Bybrisk | '+req.body.businessName,
            bName: req.body.businessName,
            bCityName : req.body.businessCity,
            link1:'Basic Info',
            link2:'Getting started',
            link3:'>> Launching',
            link4:'',
            email:req.body.emailbusiness});
});

router.post('/itemInfoAdded', function(req, res, next) {
    //let docRef = db.collection('storeItems').doc(req.body.emailbusiness);
    //let bPartnerInfo = docRef.set({
     //   bybriskStore: 'Inactive',
   // },{merge: true});

    let addDoc = db.collection('storeItems').add({
        businessName: req.body.businessName,
        businessEmail: req.body.businessCity,
        itemCategory:req.body.itemCatSelect,
        itemName:req.body.commodityNameInput,
        itemBrand:req.body.commodityBrandInput,
        itemPrice:req.body.commodityPriceInput,
        itemQuantity:req.body.commodityQuantityInput
    }).then(ref => {
        console.log('Added document with ID: ', ref.id);
        let docRef = db.collection('businessItemMap').doc(req.body.emailbusiness);
        let bPartnerInfo = docRef.update({
            itemsInStore: admin.firestore.FieldValue.arrayUnion(ref.id)
        });
    });

    res.render('homepage',
        { title: 'Bybrisk | '+req.body.businessName,
            bName: req.body.businessName,
            bCityName : req.body.businessCity,
            link1:'Basic Info',
            link2:'Getting started',
            link3:'>> Launching',
            link4:'',
            email:req.body.emailbusiness});
});


module.exports = router;
