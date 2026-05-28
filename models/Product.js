const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:    { type: String, required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    category:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand:       { type: String, default: '' },
    images:      [{ url: String, public_id: String }],
    stock:       { type: Number, required: true, default: 0, min: 0 },
    sold:        { type: Number, default: 0 },
    ratings:     { type: Number, default: 0 },
    numReviews:  { type: Number, default: 0 },
    reviews:     [reviewSchema],
    isFeatured:  { type: Boolean, default: false },
    tags:        [String],
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-calc average rating
productSchema.methods.calcAverageRatings = function () {
  if (this.reviews.length === 0) { this.ratings = 0; this.numReviews = 0; return; }
  const avg = this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length;
  this.ratings = Math.round(avg * 10) / 10;
  this.numReviews = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);
