import React from 'react';
import { Container, Header, Image, Divider, Segment } from 'semantic-ui-react'
import '../CSS/About.css'

function About(props) {
    return (
        <div style={{overflowX: "scroll", display: "flex"}}>
        <div className="content-box body about">
                <Container className="about-us">
                    <Header as="h1">About Us</Header>
                    <p className="top-content">
                        Hello! My name is Griffin Poole and welcome to Seismix! Seismix is an open access website dedicated to providing up-to-date real time information on worldwide seismic activity. We query data from the publicly available USGS API and display various graphics and visuals for organizing and observing seismic events.
                    </p>
                    <div className="frame">
                        <Image src="about.jpg"></Image>
                    </div>
                    <p>I started Seismix as a proof of concept project after visiting an exhibit on Technology at the Museum of Modern Art. The picture above is me standing in front of the very same exhibit :D.</p>
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
                    <p>Intensity is interesting as it is a very different value from magnitude despite them sounding so similar. Intensity is a measure of the degree of shaking at a site as the result of a seismic event. It is also used to refer to the impact of an earthquake on human structures or locales.</p>
                    <p>Intensity of a quake differs in magnitude in a few ways. For one, every seismic event has a single magnitude corresponding to the total 'force' of the event, whereas any seismic event can and does have many intensities. Intensities are geographically based, with intensity of the same event at one location being larger/smaller than intensity at another. Causes of variation can be distance from origin, depth of the event, local geology and more.</p>
                    <p>Also, not every event may recieve an intensity score. Small enough events or events with deep enough origins may never result in substantial ground shaking, and so won't recieve an intensity score.</p>
                </Segment>
                <Segment className="about-content">
                    <Header className="about-sub" sub>Frequency of Events</Header>
                    <Divider></Divider>
                    <p>Sesimic events happen a lot more frequently than you might think. Our application sourcing from USGS alone can show that over the course of a week, as low as 1k all the way up to 3k events can be logged in a single week.</p>
                    <p>However, as you begin to move up the magnitude scale, the frequency of events at given magnitudes begins to drop off sharply. UPSEIS, the site we sourced our quake advisories from provides some approximate occurrence rates for events of different magnitudes.</p>
                    <ul>
                        <li><strong>2.5 or less:</strong> 900,000/yr</li>
                        <li><strong>2.5 to 5.4:</strong> 30,000/yr</li>
                        <li><strong>5.5 to 6.0:</strong> 500/yr</li>
                        <li><strong>6.1 to 6.9:</strong> 100/yr</li>
                        <li><strong>7.0 to 7.9:</strong> 20/yr</li>
                        <li><strong>8.0 or more:</strong> One every 5 to 10 years</li>
                    </ul>
                    <p>You may also notice that as you go back in our app, there may appear to be more events logged recently than in the past. It is in fact the case that the number of seismic events on record per year has been increasing over the past century. However, this is due to the over 10-fold increase in seismic statios world wide over the same amount of time.</p>
                    <p>While the number of events is not necessarily increasing, the visibility and detection of these events has increased substantially over the past several decades. An increase we can take full advantage of with accessible APIs and toolkits.</p>
                </Segment>
            </Container>
        </div>
        </div>
    );
}

export default About;