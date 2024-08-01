import React, { useEffect, useState } from "react";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setError("No user data found.");
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/signup');
  };

  if (loading) {
    return (
      <Container className="text-center my-4">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center my-4">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => navigate('/signup')}>Go to Signup</Button>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="my-4">User Profile</h1>
      {user ? (
        <Card className="text-center">
          <Card.Body>
            {user.profilePicture && (
              <Card.Img
                variant="top"
                src={user.profilePicture}
                alt="Profile"
                className="mb-3 rounded-circle"
                style={{ width: '150px', height: '150px' }}
              />
            )}
            <Card.Title>{user.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{user.email}</Card.Subtitle>
            <Card.Text>
              <strong>Role:</strong> {user.isAdmin ? "Admin" : "User"}
            </Card.Text>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </Container>
  );
};

export default Profile;
