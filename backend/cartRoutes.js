const express = require("express");
const Cart = require("./db/Cart"); // Ensure the path is correct
const Product = require("./db/Product");
const jwt = require("jsonwebtoken");
const router = express.Router();
const jwtkey = "e-commm"; // Define your JWT secret key

// Middleware to verify token
function verifyToken(req, res, next) {
  let token = req.headers["authentication"];
  if (token) {
    token = token.split(" ")[1]; // Extract the token from the header
    jwt.verify(token, jwtkey, (err, valid) => {
      if (err) {
        return res.status(401).send({ result: "please provide a valid token" });
      } else {
        req.userId = valid.id; // Attach user ID to request for further use
        next(); 
      }
    });
  } else {
    return res.status(400).send({ result: "please add token with header" });
  }
}

// Add a new product to the cart
router.post("/cart", verifyToken, async (req, res) => {
  const { userId, productId, quantity } = req.body; // Destructure the request body

  // Validate input
  if (!userId || !productId || !quantity) {
    return res.status(400).json({ error: "userId, productId, and quantity are required" });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      // If cart exists, update it
      const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId); // Compare with string conversion
      if (productIndex > -1) {
        // Product exists in cart, update quantity
        cart.products[productIndex].quantity += quantity; // Increment quantity
      } else {
        // Product does not exist in cart, add it
        cart.products.push({ productId, quantity }); // Add new product
      }
      await cart.save();
      return res.status(200).json(cart); // Return updated cart
    } else {
      // If cart does not exist, create a new one
      const newCart = await Cart.create({ userId, products: [{ productId, quantity }] });
      return res.status(201).json(newCart); // Return new cart
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get cart items for a specific user
// Get cart items for a specific user
// Get cart items for a specific user
router.get("/cart/:userId", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Get product IDs from the cart
    const productIds = cart.products.map(p => p.productId);
    
    // Fetch product details for those IDs
    const products = await Product.find({ _id: { $in: productIds } });

    // Create a new array that combines cart product info with product details
    const cartItemsWithDetails = cart.products.map(cartItem => {
      const product = products.find(p => p._id.toString() === cartItem.productId.toString());
      return {
        ...cartItem,
        productId: {
          ...product._doc, // Include the full product details
        },
      };
    });

    return res.status(200).json(cartItemsWithDetails); // Return the detailed cart items
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update quantity of a product in the cart
router.put("/cart/:userId/products/:productId", verifyToken, async (req, res) => {
  const { quantity } = req.body; // Destructure the request body
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (cart) {
      const product = cart.products.find((p) => p.productId.toString() === req.params.productId); // Ensure type consistency
      if (product) {
        product.quantity = quantity; // Update quantity
        await cart.save();
        return res.status(200).json(cart); // Return updated cart
      } else {
        return res.status(404).json({ message: "Product not found in cart" });
      }
    } else {
      return res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Remove a product from the cart
router.delete("/cart/:userId/products/:productId", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (cart) {
      cart.products = cart.products.filter((p) => p.productId.toString() !== req.params.productId); // Ensure type consistency
      await cart.save();
      return res.status(200).json(cart); // Return updated cart
    } else {
      return res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Export the router
module.exports = router;
