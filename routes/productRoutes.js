const express = require("express");
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  deleteProductImage,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProduct);
router.post("/:id/reviews", protect, addReview);
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.delete("/:id/image", protect, adminOnly, deleteProductImage); // ← new

module.exports = router;
