import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
// import { useActionData } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'

export default function Signup() {
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPass]=useState("")
    const navigate=useNavigate();
    useEffect(()=>{
      const auth=localStorage.getItem('user')
      if(auth){
        navigate('/');
      }
    })
    const collectData=async ()=>{
        let result=await fetch('http://localhost:4000/register',{
          method :'post',
          body : JSON.stringify({name,email,password}),
          headers :{
            'Content-Type' : 'application/json'
          },
        });
        result=await result.json();
        console.warn(result);
        localStorage.setItem("user",JSON.stringify(result.result));
        localStorage.setItem("token",JSON.stringify(result.auth));
        // if(result){
          navigate('/');
        // }

    }

  return (
    <div>
    <h1>Register</h1>
    <Form className='formm'>
      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Enter Name"  value={name} onChange={(e)=>setName(e.target.value)}/>
        <Form.Text className="text-muted">
        </Form.Text>
      </Form.Group>
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
      {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group> */}
      <Button variant="primary" type="button" onClick={()=>collectData()}>
        Submit
      </Button>
    </Form>
    </div>
  )
}
