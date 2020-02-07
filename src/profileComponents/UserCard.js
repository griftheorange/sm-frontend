import React from 'react';
import { Card, Image, Button, Icon, CardContent } from 'semantic-ui-react' 

function UserCard(props) {
    return (
        <Card centered style={{marginTop: "1.5em"}}>
            <Card.Content>
                <Image circular size="medium" src={props.user.imageUrl ? props.user.imageUrl : "default_pic.jpg"}></Image>
                <Button compact size="mini" style={{position: "absolute", left: "22em", top: "23em"}}><Icon name="edit" style={{display: "block", margin: "auto"}}></Icon></Button>
            </Card.Content>
            <Card.Content>
                <Card.Header>{props.user.username.charAt(0).toUpperCase() + props.user.username.slice(1)}</Card.Header>
                <Card.Content style={{display: "flex", width: "100%"}}>
                    <Card.Meta textAlign="center" style={{marginRight: "2em"}}>ADDRESS: {props.user.address ? `: ${props.user.address}` : "N/A"}</Card.Meta>
                    <Button compact size="mini" style={{position: "absolute", left: "22em"}}><Icon name="edit" style={{display: "block", margin: "auto"}}></Icon></Button>
                </Card.Content>
                <Card.Content style={{display: "flex", width: "100%"}}>
                    <Card.Meta textAlign="center" style={{marginRight: "2em"}}>RADIUS OF CONCERN: {props.user.radiusConcern ? `: ${props.user.radiusConcern}km` : "N/A"}</Card.Meta>
                    <Button compact size="mini" style={{position: "absolute", left: "22em"}}><Icon name="edit" style={{display: "block", margin: "auto"}}></Icon></Button>
                </Card.Content>
            </Card.Content>
        </Card>
    );
}

export default UserCard;