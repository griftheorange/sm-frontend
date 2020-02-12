import React from 'react';
import { Container, Header, Image, Divider, Segment } from 'semantic-ui-react'
import '../CSS/About.css'

function About(props) {
    return (
        <div style={{overflowX: "scroll", display: "flex"}}>
        <div className="content-box body about">
                <Container className="about-us">
                    <Header as="h1">About Us</Header>
                    <p>
                        Hello! My name is Griffin Poole and welcome to Seismix! Seismix is an open access website dedicated to providing up-to-date real time information on worldwide seismic activity. We query data from the publicly available USGS API and display various graphics and visuals for organizing and observing seismic events.
                    </p>
                    <Image floated="right" src="about.jpg"></Image>
                    <p>I started Seismix as a proof of concept project after visiting an exhibit on Technology at the Museum of Modern Art. The picture to the right is me standing in front of the very same exhibit :D.</p>
                    <p>The exhibit was an app written in Javascript that took wind data over the United States and animated them into moving lines to visualize wind activity on a given day. You could search for specific days and while its use might be limited and niche, I thought it was the bees knees.</p>
                    <p>It inspired me to attempt something similar within my own skillsets, and so I set out to build Seismix. Querying data, visualizing it, archiving it and sourcing the references. I've tried to include it all here in an interactive webpage.</p>
                    <p>I hope you find this site easy and fun to use, and I'm stoked to have the chance to share it with you all. Have fun!</p>
                </Container>
        </div>
        <div className="content-box body about">
            <Container className="about-us">
                <Header as="h1">About Earthquakes</Header>
                <Segment className="about-content">
                    <Header className="about-sub" sub>Magnitudes</Header>
                    <Divider></Divider>
                    <p>Earthquake magnitudes are measured on a variety of scales, with the most common being the Richter and Mercalli scales.</p>
                    <p>The value is based on the amplitude of the seismic waves it generates, and the scale is logarithmic.</p>
                    <p>What does this mean? Logarithmic scales linearize exponential growth. In other words, a magnitude 5 earthquake will actually have 10 times the amplitude of a magnitude 4, and a magnitude 6 earthquake will have 100 times the amplitude of a magnitude 4 and so on.</p>
                    <p>Also, magnitude doesn't linearly relate to total energy of the earthquake either. Energy of a wave is 10^1.5 of its amplitude. So it turns out that with each increase in magnitude, there's a 32-fold increase in seismic energy.</p>
                    <p>Typically speaking, anything below a 4-5 is negligible for day to day activities. As you move up through the 6-7s quakes get increasinly more intense, with 7.5-9s being wide-felt sometimes devastating events. Keep this in mind when querying the data.</p>
                </Segment>
                <Segment className="about-content">
                    <Header className="about-sub" sub>Intensity</Header>
                    <Divider></Divider>
                </Segment>
                <Segment className="about-content">
                    <Header className="about-sub" sub>Frequency</Header>
                    <Divider></Divider>
                </Segment>
            </Container>
        </div>
        </div>
    );
}

export default About;