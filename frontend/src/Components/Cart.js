import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Button, Form, Spinner, Alert } from "react-bootstrap";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.email : null;

  useEffect(() => {
    fetchCartItems();
  }, [userId]);

//
  const calculateTotal = (items) => {
    const totalPrice = items.reduce((acc, item) => {
      const price = parseFloat(item.productId.price) || 0;
      return acc + price * (item._doc.quantity || 0);
    }, 0);
    setTotal(totalPrice);
  };
 const fetchCartItems = async () => {
  if (!userId) {
    setError("User ID is not available");
    setLoading(false);
    return;
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/cart/${userId}`, {
      headers: {
        authentication: `bearer ${JSON.parse(
          localStorage.getItem("token")
        )}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart items");
    }

    const data = await response.json();
    setCartItems(data || []);
    calculateTotal(data || []);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
  const removeFromCart = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cart/${userId}/products/${id}`,
        {
          method: "DELETE",
          headers: {
            authentication: `bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      const updatedCartItems = cartItems.filter(
        (item) => item.productId._id !== id
      );
      setCartItems(updatedCartItems);
      calculateTotal(updatedCartItems);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setError(error.message);
    }
  };

  const handleQuantityChange = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cart/${userId}/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authentication: `bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Failed to update item quantity:", errorMessage);
        throw new Error("Failed to update item quantity");
      }

      const updatedCartItems = cartItems.map((item) =>
        item.productId._id === id
          ? { ...item, _doc: { ...item._doc, quantity } }
          : item
      );
      setCartItems(updatedCartItems);
      calculateTotal(updatedCartItems);
    } catch (error) {
      console.error("Error updating item quantity:", error);
      setError(error.message);
    }
  };

  return (
    <Container className="cart">
      <h2>Your Shopping Cart</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul className="list-group">
            {cartItems.map((item) => (
              <li
                key={item.productId._id}
                className="list-group-item glass-effect"
              >
                <div>
                  <h3
                    style={{
                      fontSize: "2.5em",
                      textTransform: "capitalize",
                      fontWeight: "600",
                      margin: "10px 0",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                      color: "#333",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {item.productId.name}
                  </h3>
                  <p style={{ textAlign: "right" }}>
                    Price: $
                    {parseFloat(item.productId.price).toFixed(2) || "N/A"}
                  </p>
                  <p style={{ textAlign: "right" }}>
                    Quantity: {item.quantity}
                  </p>
                  <Form.Group controlId={`quantity-${item.productId._id}`}>
                    <Form.Label>Update Quantity:</Form.Label>
                    <Form.Control
                      type="number"
                      value={item._doc.quantity}
                      min="1"
                      style={{
                        width: "40%",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "8px",
                      }}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.productId._id,
                          parseInt(e.target.value, 10)
                        )
                      }
                    />
                  </Form.Group>
                  <br />
                  <Button
                    variant="danger"
                    style={{
                      width: "20%",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "8px",
                    }}
                    onClick={() => removeFromCart(item.productId._id)}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <h3 className="price">Total: ${total.toFixed(2)}</h3>
          <Link to="/">
            <Button
              style={{
                margin: "6%",
                backgroundColor: "#316574",
                color: "#fff",
              }}
              variant="info"
            >
              Continue Shopping
            </Button>
          </Link>
          <Button
            style={{ margin: "6%" }}
            variant="success"
            onClick={() => alert("Proceeding to checkout...")}
          >
            Checkout
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Cart;
