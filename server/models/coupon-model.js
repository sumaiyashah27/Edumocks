const mongoose = require("mongoose");

const CouponUsageSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  couponCode: { type: String, required: true },
});

module.exports = mongoose.model("CouponUsage", CouponUsageSchema);
