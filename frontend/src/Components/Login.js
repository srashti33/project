import React,{useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Login() {
  const navigate=useNavigate();
  const [email,setEmail]=useState("")
    const [password,setPass]=useState("")
    useEffect(()=>{
      const auth=localStorage.getItem('user');
      if(auth){
        navigate('/');
      }
    })
    const handleLogin=async ()=>{
      let result=await fetch(`${process.env.REACT_APP_API_URL}/login`,{
        method:'post',
        body:JSON.stringify({email,password}),
        headers:{
          'Content-Type':'application/json'
        }
      });
      result=await result.json();
      console.warn(result);
      if(result.auth){
        localStorage.setItem("user",JSON.stringify(result.user));
        localStorage.setItem("token",JSON.stringify(result.auth));
        navigate("/");
      }else{
        alert("please enter correct details");
      }
    }
  return (
    <div>
      <h1>Login Page</h1>
      <Form className='formm'>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email"  value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <Form.Text className="text-muted">
          <span style={{color:'grey'}}>We'll never share your email with anyone else.</span>
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={password} onChange={(e)=>setPass(e.target.value)}/>
      </Form.Group>
      <Button variant="primary" type="button" onClick={()=>handleLogin()}>
        Submit
      </Button>
    </Form>
    </div>
  )
}
