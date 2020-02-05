import React, { useState } from 'react';
import { Input, Header, Button } from 'semantic-ui-react'
import '../CSS/Login.css'
import SweetAlert from 'sweetalert2-react'
import { connect } from 'react-redux'

function Login(props) {

    let [username, setUsername] = useState("")
    let [password, setPassword] = useState("")
    let [alerting, setAlerting] = useState(false)

    function handleChange(evt){
        if (evt.target.name == "username"){
            setUsername(evt.target.value)
        } else if (evt.target.name == "password"){
            setPassword(evt.target.value)
        }
    }

    function handleLogin(){

    }

    function handleCreate(){
        fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "content-type":"application/json",
                "accept":"application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(r => r.json())
        .then((response) => {
            if(response["errors"]){
                setAlerting(response["errors"])
            } else {
                window.localStorage.setItem("loggedIn", JSON.stringify(response))
                props.setLoggedIn(response)
                props.history.push('/profile')
            }
        })
    }

    function getErrors(){
        let strArr = []
        for(let key in alerting){
            strArr.push(`${key.charAt(0).toUpperCase() + key.slice(1)} ${alerting[key][0]}`)
        }
        let str = strArr.join(", ")
        return str
    }

    console.log(window.localStorage.getItem("loggedIn"))
    console.log(props)

    return (
        <div className="centerify">
            {alerting ? <SweetAlert show={true} title="Invalid Input" text={getErrors()} onConfirm={() => {setAlerting(false)}}/> : null}
            <div className="login-form">
                <Header as="h1">Login/Register</Header>
                <Input onChange={handleChange} name="username" value={username} placeholder="Username"></Input>
                <Input onChange={handleChange} name="password" value={password} placeholder="Password" type="password"></Input>
                <Button onClick={handleLogin} >Login</Button>
                <Button onClick={handleCreate} >Create Account</Button>
            </div>
        </div>
    );
}

function mapStateToProps(state){
    return {
        ...state
    }
}

function mapDispatchToProps(dispatch){
    return {
        setLoggedIn: (value) => {
            dispatch({
                type: "SET_LOGGED_IN",
                token: value
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);