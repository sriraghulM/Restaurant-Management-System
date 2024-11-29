const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true, maxlength: 60  },
  role: {
    type: String,
    enum: ["Customer", "Staff", "Manager", "Admin"],
    default: "Customer", // Default role for new users
  },
});

const foodItemSchema = new mongoose.Schema({
  ItemName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  source: { type: String, required: true },
  reservee: { type: String, default: null },
});

const CartItemSchema = new mongoose.Schema({
  foodId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  source: { type: String, required: true },
  reservee: { type: String, required: true },
});

const TableSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  accommodation: {
    type: String,
    required: true,
  },
  reservee: {
    type: String,
    required: true,
  },
  reserved: {
    type: Boolean,
    default: false,
  },
});

const refreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiryDate: { type: Date, required: true }
});

const User = mongoose.model("User", userSchema);
const FoodItem = mongoose.model("FoodItem", foodItemSchema);
const CartItem = mongoose.model("CartItem", CartItemSchema);
const Table = mongoose.model("Table", TableSchema);
const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
module.exports = { User, FoodItem, CartItem, Table, RefreshToken };
