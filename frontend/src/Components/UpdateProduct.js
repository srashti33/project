import React, { useEffect, useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { json, useNavigate, useParams } from "react-router-dom";

export default function UpdateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  //   const [param, setError] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = async () => {
    let response = await fetch(`${process.env.REACT_APP_API_URL}/${params.id}`, {
      headers: {
        authentication: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }
    let result = await response.json();
    console.log(result); // Debugging purpose
    // Populate form fields with product details
    setName(result.name);
    setPrice(result.price);
    setCategory(result.category);
    setCompany(result.company);
  };

  const handleSubmit = async (e) => {
    // if (!name || !price || !category || !company) {
    //   alert("Please fill out all fields.");
    // //   setError(true);
    //   return false;
    // }
    // const userId = JSON.parse(localStorage.getItem("user"))._id;

    let result = await fetch(`${process.env.REACT_APP_API_URL}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify({ name, price, category, company }),
      headers: {
        "Content-Type": "application/json",

        authentication: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    navigate("/");
    // console.log(result);

    // if (result) {
    //   alert("Product added successfully");
    //   navigate("/"); // Redirect to home or another page
    // } else {
    //   alert("Failed to add product");
    // }
    console.warn(result);
    console.warn(name, price, category, company);
  };

  return (
    <Container>
      <h1>Update Product</h1>
      <Form onSubmit={handleSubmit} className="formm">
        <Form.Group className="mb-3 " controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCompany">
          <Form.Label>Company</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="button" onClick={() => handleSubmit()}>
          Update
        </Button>
      </Form>
    </Container>
  );
}
