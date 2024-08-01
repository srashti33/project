import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap"; 
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productPP] = useState(12);
  const [loading, setLoading] = useState(false); // Loading state for fetching products
  const [cart, setCart] = useState([]); 

  useEffect(() => {
    getProducts();
    checkAdminStatus();
    fetchCart(); // Fetch cart data when the component mounts
  }, []);

  // Check admin status
  const checkAdminStatus = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.isAdmin) {
      setIsAdmin(user.isAdmin);
    }
  };

  // Handle search input
  const handleSearch = async (e) => {
    const key = e.target.value;
    setQuery(key);

    if (key.length > 0) {
      setLoading(true); // Start loading
      try {
        const response = await fetch(`http://localhost:4000/search/${key}`, {
          headers: {
            authentication: `bearer ${JSON.parse(localStorage.getItem('token'))}`
          }
        });
        if (response.ok) {
          const result = await response.json();
          setProducts(result);
        } else {
          console.error("Error fetching search results:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false); // End loading
      }
    } else {
      getProducts();
    }
  };

  // Fetch products
  const getProducts = async () => {
    setLoading(true); // Start loading
    
    const response = await fetch("http://localhost:4000/products", {
      headers: {
        authentication: `bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    });
    if (response.ok) {
      const result = await response.json();
      setProducts(result);
    } else {
      console.error("Error fetching products:", response.statusText);
    }

    setLoading(false); // End loading
  };

  // Fetch cart items for the user
  const fetchCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return; // If user is not logged in, exit

    const userId = user.email; // Get user ID from local storage
    try {
      const response = await fetch(`http://localhost:4000/cart/${userId}`, {
        headers: {
          authentication: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      });

      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData); // Set cart state with data from the database
      } else {
        console.error("Error fetching cart:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`http://localhost:4000/product/${id}`, {
          method: "DELETE",
          headers: {
            authentication: `bearer ${JSON.parse(localStorage.getItem('token'))}`
          }
        });
        if (response.ok) {
          setProducts(products.filter((product) => product._id !== id));
        } else {
          console.error("Error deleting product:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Add a product to the cart
  const addToCart = async (product) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user ? user.email : null; // Get user ID from local storage
      if (!userId) {
        alert("Please log in to add products to your cart.");
        return;
      }
      
      const response = await fetch("http://localhost:4000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authentication: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        },
        body: JSON.stringify({
          userId: userId,
          productId: product._id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product to cart");
      }

      const updatedCart = await response.json(); // Get the updated cart from the response
      console.log("Updated Cart:", updatedCart); // Optional: Log the updated cart

      // Update local cart state
      setCart((prevCart) => {
        const existingProduct = prevCart.find((item) => item.productId === product._id);
        // console.log("fghvjn",prevCart,existingProduct)
        if (existingProduct) {
          console.log(existingProduct._doc.quantity);
          return prevCart.map((item) =>
            item.productId === product._id
              ? { ...item, quantity: item._doc.quantity + 1 }
              : item
          );
        } else {
          return [...prevCart, { ...product, quantity: 1 }];
        }
      });

      alert(`${product.name} has been added to your cart.`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("There was an error adding the product to your cart.");
    }
  };

  const indexLastP = currentPage * productPP;
  const indexFirstP = indexLastP - productPP;
  const currentP = products.slice(indexFirstP, indexLastP);
  
  const totalPages = Math.ceil(products.length / productPP);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Container>
      <h1 className="my-4">Product List</h1>
      <input
        type="text"
        className="form-control me-2"
        placeholder="Search"
        value={query}
        onChange={handleSearch}
        aria-label="Search for products"
      />
      <br />
      {loading && <p>Loading products...</p>} {/* Loading message */}
      <Row>
        {currentP.length > 0 ? (
          currentP.map((product, index) => (
            <Col md={3} key={product._id} className="mb-4">
              <Card className="translucent-card card fade-in" style={{ '--fade-in-delay': `${index * 0.1}s` }}>
                <Card.Img variant="top" src={product.image} alt={product.name} />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Category: {product.category}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Price:</strong> ${product.price}
                  </Card.Text>
                  <Card.Text>
                    <strong>Company:</strong> {product.company}
                  </Card.Text>
                  {!isAdmin ? (
                    <Button
                      variant="success" 
                      onClick={() => addToCart(product)} 
                    >
                      Add to Cart
                    </Button>
                  ) : " "}
                  {isAdmin && (
                    <>
                      <Button
                        variant="danger"
                        className="btn-delete"
                        onClick={() => deleteProduct(product._id)}
                      >
                        Delete
                      </Button>
                      <br />
                      <br />
                      <Link to={"/update/" + product._id} style={{ textDecoration: "none" }}>
                        <Button variant="primary" className="btn-update">Update</Button>
                      </Link>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>No products found</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
      <div className="d-flex justify-content-between butt">
        <Button 
          variant="secondary" 
          onClick={handlePrevPage} 
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button 
          variant="secondary" 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      <br />
    </Container>
  );
}
