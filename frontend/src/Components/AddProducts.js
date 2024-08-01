import 



React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AddProducts() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
    const [error,setError]=useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    if (!name || !price || !category || !company) {
        alert("Please fill out all fields.");
        setError(true);
      return false;
    }
    const userId = JSON.parse(localStorage.getItem("user"))._id;

    let result = await fetch("http://localhost:4000/add-product", {
      method: "POST",
      body: JSON.stringify({ name, price, category, company, userId,image:"https://miro.medium.com/v2/resize:fit:2800/0*OqpTl9j-4UyfU0Hr.jpeg" }),
      headers: {
        "Content-Type": "application/json",

          authentication: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        
      },
    });
    result = await result.json();
    console.log(result);

    if (result) {
      alert("Product added successfully");
      navigate("/"); // Redirect to home or another page
    } else {
      alert("Failed to add product");
    }
  };

  return (
    <Container>
      <h1>Add New Product</h1>
      <Form onSubmit={handleSubmit} className="formm">
        <Form.Group className="mb-3 " controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          { !name && <span className="invalid-input">Enter valid name</span>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          { !price && <span className="invalid-input">Enter valid price</span>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          { !category && <span className="invalid-input">Enter valid category</span>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCompany">
          <Form.Label>Company</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          {!company && <span className="invalid-input">Enter valid company</span>}
        </Form.Group>

        <Button variant="primary" type="button" onClick={() => handleSubmit()}>
          Submit
        </Button>
      </Form>
    </Container>
  );
}
