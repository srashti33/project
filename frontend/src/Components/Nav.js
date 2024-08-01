import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Nav() {
  const auth = localStorage.getItem('user');
  // console.warn("rtfyguhijk"+auth);
  const user = auth ? JSON.parse(auth) : " "; 
  const isAdmin = user ? user.isAdmin : false; 
  const navigate = useNavigate();
  // console.warn(auth,user,isAdmin);

  const logout = () => {
    localStorage.clear();
    navigate('/signup');
  };

  return (
    <div>
      <img 
        alt="logo" 
        className="logo" 
        src="https://w7.pngwing.com/pngs/621/196/png-transparent-e-commerce-logo-logo-e-commerce-electronic-business-ecommerce-angle-text-service.png" 
      />
      {
        auth ? (
          <ul className='nav-ul'>
            <li><Link to="/">Products</Link></li>
            {isAdmin && <li><Link to="/add">Add Products</Link></li>} {/* Conditionally render Add Products */}
            {/* {isAdmin && <li><Link to="/update">Update Products</Link></li>} Conditionally render Update Products */}
            <li><Link to="/profile">Profile</Link></li>
            {!isAdmin&&<li><Link to="/cart">Cart</Link></li>}
            <li><Link onClick={logout} to="/signup">Logout ({user.email})</Link></li> {/* Access user name directly */}
          </ul>
        ) : (
          <ul className='nav-ul nav-right'>  
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        )
      }
    </div>
  );
}
