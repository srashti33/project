const express = require("express");
const cors = require("cors");
require("./db/config");

const jwt=require('jsonwebtoken')
const jwtkey='e-commm'


const User = require("./db/User");
const Product = require("./db/Product");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  jwt.sign({result},jwtkey,{expiresIn:"2h"},(err,token)=>{
    if(err){
      res.send({result:"something went wrong , please try again later"});
    }
    res.send({result,auth:token});
  })
  // res.send(result);
});

app.post("/login", async (req, res) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      jwt.sign({user},jwtkey,{expiresIn:"2h"},(err,token)=>{
        if(err){
          res.send({result:"something went wrong , please try again later"});
        }
        res.send({user,auth:token});
      })
    } else {
      res.send({ result: "no user found" });
    }
  } else {
    res.send({ result: "no user found" });
  }
});

app.post("/add-product", async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});

app.get("/products", async (req, res) => {
  let products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "no products found" });
  }
});

app.delete("/product/:id", async (req, res) => {
  // res.send(req.params.id);
  let result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});

app.get("/product/:id", async (req, res) => {
    // req.send(req.params._id)
  let result = await Product.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "no record found" });
  }
});


app.put("/product/:id",async(req,res)=>{
    let result=await Product.updateOne(
        {_id : req.params.id},
        {
            $set: req.body
        }
    )
    res.send(result);
})


app.get("/search/:key", async (req,res)=>{
    let result = await Product.find({
        "$or" : [
            {name:{$regex:req.params.key}},
            {company:{$regex:req.params.key}},
            {category:{$regex:req.params.key}},
            {price:{$regex:req.params.key}}
        ]
    })
    res.send(result);
})

app.listen(4000, () => {
  console.log("app is running");
});
