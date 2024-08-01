import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import PrivateComponent from "./PrivateComponent";
import AddProducts from "./AddProducts";
import ProductList from "./ProductList";
import UpdateProduct from "./UpdateProduct";
import Profile from "./Profile";
import Categories from "./Categories";
// import Categories from "./Categories";
import Cart from "./Cart";
export default function Routing() {
  return (
    <div>
      <Routes>
        <Route element={<PrivateComponent />}>
          {/* <Route path="/" element={<ProductList/>} /> */}
          <Route path="/" element={<Categories/>} />
          <Route path="/products/category/:category" element={<ProductList />} />
          <Route path="/add" element={<AddProducts/>} />
          <Route path="/update/:id" element={<UpdateProduct/>} />

          <Route path="/logout" element={<h1>Logout component</h1>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/cart" element={<Cart/>} />
        </Route>
        
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
