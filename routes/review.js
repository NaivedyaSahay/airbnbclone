const express=require("express");
const router=express.Router({mergeParams:true});

const wrapAsync=require("../util/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const ExpressError=require("../util/ExpressError.js");



//POST REVIEW ROUTES
router.post("" ,isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
  const listing=await Listing.findById(req.params.id);
  let newReview=new Review(req.body.review);
  newReview.author=req.user._id;
  listing.reviews.push(newReview);
 
  await newReview.save();
  await listing.save();
  req.flash("success","New Review Created!");
  res.redirect(`/listings/${listing._id}`);
}));

//DELETE REVIEW ROUTES
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
  let{id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews  :reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted!");
  res.redirect(`/listings/${id}`); 
}));

module.exports=router;