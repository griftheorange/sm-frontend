import React from 'react';
import { Input, Header, Button } from 'semantic-ui-react'
import '../CSS/Login.css'

function Login(props) {
    return (
        <div className="centerify">
            <div className="login-form">
                <Header as="h1">Login/Register</Header>
                <Input placeholder="Username"></Input>
                <Input placeholder="Password"></Input>
                <Button>Login</Button>
                <Button>Create Account</Button>
            </div>
        </div>
    );
}

export default Login;