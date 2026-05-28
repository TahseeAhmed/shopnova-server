const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads");

// helper: delete image file from disk
const deleteImageFile = (url) => {
  try {
    if (!url) return;
    const filename = url.split("/uploads/")[1];
    if (!filename) return;
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {}
};

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      rating,
      sort,
      page = 1,
      limit = 12,
    } = req.query;
    const query = { isActive: true };
    if (keyword) query.name = { $regex: keyword, $options: "i" };
    if (category) query.category = category;
    if (minPrice || maxPrice)
      query.price = {
        ...(minPrice && { $gte: +minPrice }),
        ...(maxPrice && { $lte: +maxPrice }),
      };
    if (rating) query.ratings = { $gte: +rating };

    const sortMap = {
      price_asc: "price",
      price_desc: "-price",
      rating: "-ratings",
      newest: "-createdAt",
      popular: "-sold",
    };
    const sortBy = sortMap[sort] || "-createdAt";
    const skip = (+page - 1) * +limit;
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sortBy)
      .skip(skip)
      .limit(+limit);

    res.json({
      success: true,
      products,
      total,
      page: +page,
      pages: Math.ceil(total / +limit),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products/featured
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate("category", "name")
      .limit(8);
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products/:id
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name slug")
      .populate("reviews.user", "name avatar");
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/products (admin)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // ── Required fields check ───────────────────────────────
    if (!name || !description || !price || !category || stock === undefined)
      return res.status(400).json({
        success: false,
        message: "name, description, price, category and stock are required",
      });

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/products/:id (admin)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/products/:id (admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    // ── Delete all images from disk when product deleted ────
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => deleteImageFile(img.url));
    }

    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/products/:id/image (admin) — remove one image from product
exports.deleteProductImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    // Delete file from disk
    deleteImageFile(imageUrl);

    // Remove from product images array
    product.images = product.images.filter((img) => img.url !== imageUrl);
    await product.save();

    res.json({ success: true, message: "Image removed", product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/products/:id/reviews
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment)
      return res
        .status(400)
        .json({ success: false, message: "Rating and comment required" });

    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const already = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString(),
    );
    if (already)
      return res
        .status(400)
        .json({ success: false, message: "Already reviewed" });

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: +rating,
      comment,
    });
    product.calcAverageRatings();
    await product.save();
    res.status(201).json({ success: true, message: "Review added" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
