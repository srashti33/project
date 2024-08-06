import React from 'react'
import { Container } from 'react-bootstrap';
export default function Footer() {
  return (
    <footer className="footer">
      <Container>
        <p>&copy; {new Date().getFullYear()} E-comm. All Rights Reserved.</p>
        
          <a href="/privacy-policy" style={{ color: '#fff', textDecoration: 'none' }}>Privacy Policy</a> | 
          <a href="/terms-of-service" style={{ color: '#fff', textDecoration: 'none' }}> Terms of Service</a>
      </Container>
    </footer>
  )
}
