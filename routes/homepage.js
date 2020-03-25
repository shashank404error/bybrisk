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

router.post('/itemInfoAdded', function(req, res, next) {

    let addDoc = db.collection('storeItems').add({
        businessName: req.body.businessName,
        businessEmail: req.body.emailbusiness,
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

    fetchAllItemsAndLoadHomePage(req,res,req.body.emailbusiness,req.body.businessName,req.body.businessCity);


});

function fetchAllItemsAndLoadHomePage(req,res,businessEmail,businessName,businessCity){
    //fetch store items for homepage
    var objItemIndividual = new Array();
    var bname = new Array();
    var itemBrand = new Array();
    var itemCat = new Array();
    var itemName = new Array();
    var itemQuantity = new Array();
    var itemprice = new Array();

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
                        emptyErr:'Your Store Is Empty'});
            }
            snapshot.forEach(doc => {
                //console.log(doc.id, '=>', doc.data());
                objItemIndividual.push(doc.data());
            });
            console.log(objItemIndividual);
            res.render('homepage',
                { title: 'Bybrisk | '+businessName,
                    bName: businessName,
                    bCityName : businessCity,
                    link1:'Your Store',
                    link2:'Profile',
                    link3:'logout',
                    link4:'',
                    email:businessEmail,
                    objItemData:objItemIndividual,
                    emptyErr:''});
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });

            }

module.exports = router;
