import React from 'react';

import Weekly from '../homeComponents/Weekly'
import GuideBox from '../homeComponents/GuideBox'

import '../CSS/Home.css';

function Home(props) {
    return (
        <>
        <Weekly/>
        <GuideBox history={props.history}/>
        </>
    );
}

export default Home;