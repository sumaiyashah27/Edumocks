const express = require("express");
const CouponUsage = require("../models/coupon-model"); // Import Schema
const router = express.Router();

// ✅ Check if a coupon has already been used
router.post("/check", async (req, res) => {
  const { studentId, couponCode } = req.body;
  const used = await CouponUsage.findOne({ studentId, couponCode });
  res.json({ valid: !used });
});

// ✅ Save the coupon usage
router.post("/save", async (req, res) => {
  await new CouponUsage(req.body).save();
  res.json({ success: true });
});

module.exports = router;
