import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve user info from local storage

  const handleLogout = () => {
    localStorage.clear(); // Clear local storage
    navigate('/signup'); // Redirect to signup or login page
  };

  return (
    <Container>
      <h1 className="my-4">User Profile</h1>
      {user ? (
        <Card className="text-center">
          <Card.Body>
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
