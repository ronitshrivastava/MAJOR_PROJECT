const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js")
const {isLoggedIn,isOwner}=require("../middleware.js");
const{validateListing}=require("../middleware.js");
const multer = require("multer");
const{storage}=require("../cloudConfig.js");
const upload = multer({storage});

const listingController = require("../controllers/listings.js");

// Search route
router.get("/search", wrapAsync(async (req, res) => {
    let query = req.query.q;

    if (!query || query.trim() === "") {
        return res.redirect("/listings");
    }

    const listings = await Listing.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } },
            { country: { $regex: query, $options: "i" } }
        ]
    });

    res.render("listings/searchResults.ejs", { listings, query });
}));

router.route("/")
.get(validateListing, wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.createListing));

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(validateListing, wrapAsync(listingController.showListings))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.editListing));



module.exports = router;
