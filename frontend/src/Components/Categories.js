import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Spinner, Alert } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/products`, {
                    headers: {
                        authentication: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                const uniqueCategories = [...new Set(data.map(item => item.category))]; 
                setCategories(uniqueCategories);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

  
    useEffect(() => {
        console.log(categories);
    }, [categories]);

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">Error fetching categories: {error.message}</Alert>;

    return (
        <Container className="categories-container">
            <h1>Categories</h1>
            <Row>
                {categories.map((category, index) => (
                    <Col xs={12} sm={6} md={4} lg={3} key={index} className="mb-4">
                        <Link to={`/products/category/${category}`} style={{ textDecoration: "none" }}>
                            <Card className="category-card">
                                <Card.Body>
                                    <Card.Title>{category}</Card.Title>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Categories;
