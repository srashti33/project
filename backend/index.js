
const express = require("express");
const cors = require("cors");
require("./db/config");

const jwt = require("jsonwebtoken");
const jwtkey = "e-commm";

const User = require("./db/User");
const Product = require("./db/Product");
const CartRoutes = require("./cartRoutes"); 

const app = express();

app.use(express.json());
app.use(cors({
  origin:'*'
}));

app.post("/api/v1/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  jwt.sign({ result }, jwtkey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      return res.send({
        result: "something went wrong, please try again later",
      });
    }
    res.send({ result, auth: token });
  });
});

app.post("/api/v1/login", async (req, res) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      jwt.sign({ user }, jwtkey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          return res.send({
            result: "something went wrong, please try again later",
          });
        }
        res.send({ user, auth: token });
      });
    } else {
      res.send({ result: "no user found" });
    }
  } else {
    res.send({ result: "no user found" });
  }
});

app.post("/api/v1/add-product",verifyToken, async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});

app.get("/api/v1/products",verifyToken, async (req, res) => {
  let products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "no products found" });
  }
});

app.delete("/api/v1/product/:id",verifyToken, async (req, res) => {
  let result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});

app.get("/api/v1/product/:id",verifyToken, async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "no record found" });
  }
});
app.get("/api/v1/products/category/:category", verifyToken, async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category: category });
    if (products.length > 0) {
      res.json(products);
    } else {
      res.status(404).json({ result: "No products found in this category." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/v1/product/:id",verifyToken, async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  res.send(result);
});

app.get("/api/v1/search/:key", verifyToken, async (req, res) => {
  let result = await Product.find({
    $or: [
      { name: { $regex: req.params.key, $options: "i" } }, 
      { company: { $regex: req.params.key, $options: "i" } },
      { category: { $regex: req.params.key, $options: "i" } },
      { price: { $regex: req.params.key } },
    ],
  });
  res.send(result);
});


app.use("/api/v1/", CartRoutes);

function verifyToken(req, res, next) {
  let token = req.headers["authentication"];
  if (token) {
      token = token.split(" ")[1];
      jwt.verify(token, jwtkey, (err, valid) => {
          if (err) {
              return res.status(401).send({ result: "please provide valid token" });
          } else {
              next(); 
          }
      });
  } else {
      return res.status(400).send({ result: "please add token with header" });
  }
}


module.exports = { verifyToken };
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});



app.listen(4000, () => {
  console.log("App is running on http://localhost:4000");
});
