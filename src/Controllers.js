const bcrypt = require("bcryptjs");
const { User, FoodItem, CartItem, Table, RefreshToken } = require("./Models");
const jwt = require("jsonwebtoken");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET_KEY, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign(
    { id: user._id, email: user.email },
    REFRESH_SECRET_KEY,
    { expiresIn: "7d" }
  );
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);

  const newRefreshToken = new RefreshToken({
    token: refreshToken,
    userId: user._id,
    expiryDate: expiryDate,
  });

  await newRefreshToken.save();
  return refreshToken;
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, address, phoneNumber, password } = req.body;

  if (!name || !email || !address || !phoneNumber || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Please login." });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const role = token ? decoded.role : 'Customer';

    const user = new User({
      name,
      email,
      address,
      phoneNumber,
      password: hashedPassword,
      role
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "User does not exist. Please register." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const token = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    // Send tokens to client
    res.json({ token, refreshToken, userId: user._id });
  } catch (error) {
    console.error("Error logging in:", error);
    res
      .status(500)
      .json({ message: "Failed to login. Please try again later." });
  }
};

//Refresh token

const refreshToken = async (req, res) => {
  const { token: requestToken } = req.body;

  if (!requestToken) {
    return res.status(403).json({ message: "Refresh Token is required" });
  }

  try {
    const refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      return res
        .status(403)
        .json({ message: "Refresh token is not in database!" });
    }

    if (refreshToken.expiryDate < new Date()) {
      await RefreshToken.findByIdAndRemove(refreshToken._id);
      return res
        .status(403)
        .json({
          message: "Refresh token was expired. Please make a new login request",
        });
    }

    const user = await User.findById(refreshToken.userId);
    const newAccessToken = generateAccessToken(user);

    return res.json({ token: newAccessToken });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

const protectedRoute = (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
};

// Get all food items
const getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.json(foodItems);
  } catch (err) {
    console.error("Error fetching food items:", err);
    res.status(500).json({ message: "Error fetching food items" });
  }
};

// Add a new food item
const addFoodItem = async (req, res) => {
  const { ItemName, price, quantity, source, reservee } = req.body;

  if (!ItemName || !price || !source) {
    return res
      .status(400)
      .json({ message: "ItemName, price, and source are required" });
  }

  try {
    const existingFoodItem = await FoodItem.findOne({ ItemName });
    if (existingFoodItem) {
      return res.status(400).json({ message: "Food item already exists" });
    }

    const foodItem = new FoodItem({
      ItemName,
      price,
      quantity,
      source,
      reservee,
    });

    await foodItem.save();
    res.status(201).json({ message: "Food item added successfully", foodItem });
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).json({ message: "Error adding food item" });
  }
};
const deleteFoodItem = async (req, res) => {
  try {
    await FoodItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Food item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting food item", error });
  }
};

//Cart

const createOrder = async (req, res) => {
  try {
    const orderItems = req.body.map((item) => ({
      ...item,
    }));

    await CartItem.insertMany(orderItems);

    res.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

const getCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find();
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart items", error });
  }
};

const getCartItemById = async (req, res) => {
  try {
    const cartItem = await CartItem.findById(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(200).json(cartItem);
  } catch (error) {
    console.error("Error fetching cart item:", error);
    res
      .status(500)
      .json({ message: "Error fetching cart item", error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const updatedItem = await CartItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart item", error });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Cart item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting cart item", error });
  }
};

//Table

const reserveTable = async (req, res) => {
  const { number, time, date, accommodation, reservee } = req.body;

  try {
    const table = new Table({
      number,
      time,
      date,
      accommodation,
      reservee,
      reserved: true,
    });

    await table.save();
    res.status(201).send(table);
  } catch (error) {
    res.status(400).send({ error: "Error reserving table" });
  }
};

// Get all tables
const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.status(200).send(tables);
  } catch (error) {
    res.status(400).send({ error: "Error fetching tables" });
  }
};

//Assigning role to the users

const assignRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `Role updated to ${user.role}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  registerUser,
  login,
  refreshToken,
  protectedRoute,
  getUsers,
  getAllFoodItems,
  addFoodItem,
  deleteFoodItem,
  createOrder,
  getCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem,
  reserveTable,
  getAllTables,
  assignRole
};
