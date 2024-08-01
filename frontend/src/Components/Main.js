import React from "react";
import style from "../style.css";
import { BrowserRouter } from "react-router-dom";
import Nav from "./Nav";
import Routing from "./Routing";
import Footer from "./Footer";
import Signup from "./Signup";


export default function Main() {
  return (
    <div>
      <BrowserRouter>
        <Nav />
        <Routing/>
      </BrowserRouter>
    
      <Footer/>
    </div>
  );
}
