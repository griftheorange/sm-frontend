import React, { useState, useEffect } from 'react';
import { Card, Image, Button, Icon, Label, Input } from 'semantic-ui-react' 
import { connect } from 'react-redux';

function UserCard(props) {

    let [editing, setEditing] = useState(null)
    let [imgFile, setImgFile] = useState("")
    let [imgURL, setImgURL] = useState(null)
    let [addressField, setAddressField] = useState("")
    let [radiusField, setRadiusField] = useState("")
    let[address, setAddress] = useState(null)
    let [radius, setRadius] = useState(null)

    useEffect(() => {
        if(props.user.image_url){getImage(props.user.image_url)}
        if(props.user.address){
            setAddressField(props.user.address)
            setAddress(props.user.address)
        }
        if(props.user.radius_concern){
            setRadiusField(props.user.radius_concern)
            setRadius(props.user.radius_concern)
        }
    }, [])

    function getEditBox(){
        if (editing){
            return (
                <Card.Content>
                    <Card.Header>{editing == "image" ? "Edit Profile Pic" : editing == "address" ? "Edit Address" : "Edit Radius of Concern"}</Card.Header>
                    {getForm()}
                </Card.Content>
            )
        }
    }

    function getImage(url){
        setImgURL(url)
    }

    function saveUserImage(){
        if(imgFile != ''){
            let file = document.querySelector("input[type='file']").files[0]
            let formData = new FormData();
            formData.append('file', file);
            let options = {
                method: 'PATCH',
                body: formData
            }
            fetch(`http://${props.domain}/users/${props.user.id}`, options)
            .then(r => r.json())
            .then((response) => {
                if(!response.errors){
                    getImage(response.image_url)
                    setEditing(null)
                    setImgFile("")
                }
            })

        }
    }

    function saveAddress(){
        if(addressField != ''){
            fetch(`http://${props.domain}/users/${props.user.id}`, {
                method: "PATCH",
                headers: {
                    "content-type":"application/json",
                    "accept":"application/json"
                },
                body: JSON.stringify({
                    address: addressField
                })
            })
            .then(r => r.json())
            .then((response) => {
                if(!response.errors){
                    setAddress(addressField)
                    setEditing(null)
                }
            })
        }
    }

    function saveRadius(){
        console.log(radiusField)
        if(radiusField != ''){
            fetch(`http://${props.domain}/users/${props.user.id}`, {
                method: "PATCH",
                headers: {
                    "content-type":"application/json",
                    "accept":"application/json"
                },
                body: JSON.stringify({
                    radius: radiusField
                })
            })
            .then(r => r.json())
            .then((response) => {
                if(!response.errors){
                    setRadius(radiusField)
                    setEditing(null)
                }
            })
        }
    }

    function getForm(){
        if(editing == "image"){
            return (
                <div className="ui action input" style={{width: "100%"}}>
                    <Input onChange={(evt)=>{setImgFile(evt.target.value)}} type="file" style={{width: "70%"}} value={imgFile}></Input>
                    <Button onClick={saveUserImage} style={{width: "30%"}}>Submit</Button>
                </div>
            )
        } else if(editing == "address"){
            return (
                <div className="ui action input" style={{width: "100%"}}>
                    <Input onChange={(evt)=>{setAddressField(evt.target.value)}} style={{width: "70%"}} value={addressField}></Input>
                    <Button onClick={saveAddress} style={{width: "30%"}}>Submit</Button>
                </div>
            )
        } else if(editing == "radius"){
            return (
                <div className="ui action input" style={{width: "100%"}}>
                    <Input onChange={(evt)=>{setRadiusField(evt.target.value)}} style={{width: "70%"}} value={radiusField} type="number"></Input>
                    <Button onClick={saveRadius} style={{width: "30%"}}>Submit</Button>
                </div>
            )
        }
    }

    function toggleEditing(value){
        if(editing){
            if(editing == value ){
                setEditing(null)
            } else {
                setEditing(value)
            }
        } else {
            setEditing(value)
        }
    }

    return (
        <div>
        <Card centered style={{marginTop: "1.5em"}}>
            <Card.Content>
                <Image circular size="medium" src={imgURL ? imgURL : "default_pic.jpg"}></Image>
                <Button onClick={() => {toggleEditing("image")}} compact size="mini" style={{position: "absolute", left: "22em", top: "23em"}}><Icon name="edit" style={{display: "block", margin: "auto"}}></Icon></Button>
            </Card.Content>
            {getEditBox()}
            <Card.Content>
                <Card.Header>{props.user.username.charAt(0).toUpperCase() + props.user.username.slice(1)}</Card.Header>
                <Card.Content style={{display: "flex", width: "100%"}}>
                    <Card.Meta textAlign="center" style={{marginRight: "2em"}}>ADDRESS: {address ? `: ${address}` : "N/A"}</Card.Meta>
                    <Button onClick={() => {toggleEditing("address")}} compact size="mini" style={{position: "absolute", left: "22em"}}><Icon name="edit" style={{display: "block", margin: "auto"}}></Icon></Button>
                </Card.Content>
                <Card.Content style={{display: "flex", width: "100%"}}>
                    <Card.Meta textAlign="center" style={{marginRight: "2em"}}>RADIUS OF CONCERN: {radius ? `: ${radius}km` : "N/A"}</Card.Meta>
                    <Button onClick={() => {toggleEditing("radius")}} compact size="mini" style={{position: "absolute", left: "22em"}}><Icon name="edit" style={{display: "block", margin: "auto"}}></Icon></Button>
                </Card.Content>
            </Card.Content>
        </Card>
        </div>
    );
}

function mapStateToProps(state){
    return (
        {
            domain: state.domain
        }
    )
}

export default connect(mapStateToProps)(UserCard);