const express = require("express");
const {
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
} = require("./Controllers");
const {authenticateToken, verifyAdmin} = require('./Middleware');
const router = express.Router();

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Test connection
 *     description: Check if the connection to the server is established.
 *     responses:
 *       200:
 *         description: Connection established.
 */
router.get("/", (req, res) => {
  res.send("Connection established");
});

// User routes
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user in the database.
 *     responses:
 *       201:
 *         description: User registered successfully.
 */
router.post("/users", registerUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve a list of users from the database.
 *     responses:
 *       200:
 *         description: Successful response with a list of users.
 */
router.get("/users", getUsers);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate user and generate a JWT token and refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/login', login);

/**
 * @swagger
 * /api/refresh-token:
 *   post:
 *     summary: Refresh the access token
 *     description: Generate a new access token using the refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *       403:
 *         description: Refresh token expired or invalid
 *       500:
 *         description: Internal server error
 */
router.post('/refresh-token', refreshToken);

/**
 * @swagger
 * /api/protected:
 *   get:
 *     summary: Protected route
 *     description: Access a protected route with a valid JWT
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/protected', authenticateToken, protectedRoute);

// Menu routes
/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Get all food items
 *     description: Retrieve a list of all food items from the menu.
 *     responses:
 *       200:
 *         description: Successful response with a list of food items.
 */
router.get("/menu", getAllFoodItems);

/**
 * @swagger
 * /api/menu:
 *   post:
 *     summary: Add a new food item
 *     description: Add a new food item to the menu.
 *     responses:
 *       201:
 *         description: Food item added successfully.
 */
router.post("/menu", addFoodItem);

/**
 * @swagger
 * /api/menu/{id}:
 *   delete:
 *     summary: Delete a food item
 *     description: Delete a food item from the menu by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the food item to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Food item deleted successfully.
 */
router.delete("/menu/:id", deleteFoodItem);

// Cart routes
/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Create a new order
 *     description: Create a new order and add items to the cart.
 *     responses:
 *       201:
 *         description: Order created successfully.
 */
router.post('/cart', createOrder);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get all cart items
 *     description: Retrieve a list of all items in the cart.
 *     responses:
 *       200:
 *         description: Successful response with a list of cart items.
 */
router.get('/cart', getCartItems);

/**
 * @swagger
 * /api/cart/{id}:
 *   get:
 *     summary: Get a cart item by ID
 *     description: Retrieve a specific cart item by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart item to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with the cart item details.
 */
router.get('/cart/:id', getCartItemById);

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Update a cart item by ID
 *     description: Update the details of a specific cart item by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart item to update.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart item updated successfully.
 */
router.put('/cart/:id', updateCartItem);

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Delete a cart item by ID
 *     description: Delete a specific cart item by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart item to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart item deleted successfully.
 */
router.delete('/cart/:id', deleteCartItem);

// Table routes

//Reserve table

/**
 * @swagger
 * /api/table:
 *   post:
 *     summary: Reserve a table
 *     description: Reserve a table at the restaurant.
 *     responses:
 *       201:
 *         description: Table reserved successfully.
 */
router.post('/table', reserveTable);

//Get tables 

/**
 * @swagger
 * /api/table:
 *   get:
 *     summary: Get all table reservations
 *     description: Retrieve a list of all table reservations.
 *     responses:
 *       200:
 *         description: Successful response with a list of table reservations.
 */
router.get('/table', getAllTables);

// Admin routes

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: Assign a role to a user
 *     description: Admins can assign a specific role to a user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to assign a role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: Manager
 *     responses:
 *       200:
 *         description: Role successfully assigned.
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: User not found.
 */

router.put('/users/:userId', verifyAdmin, assignRole);


module.exports = router;
