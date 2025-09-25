const express = require('express');
const { createListing, getListings, getListingById, updateListing, deleteListing } = require('../controllers/listing.controller');
const router = express.Router();

router.post('/listings', createListing);
router.get('/listings', getListings);
router.get('/listings/:id', getListingById);
router.patch('/listings/:id', updateListing);
router.delete('/listings/:id', deleteListing);

module.exports = router;
