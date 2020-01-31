import React from 'react';

import FetchForm from './FetchForm'

function GuideBox(props) {
    return (
        <div className="guide-box content-box">
            <div className="content-box header">
                <h1>Guide</h1>
            </div>
            <FetchForm/>
            <div className="content-box body">
            </div>
            <div className="globe-view-box">
                <div className="header">
                    <h1>Globe View</h1>
                </div>
                <div className="globe-img-box">
                    
                </div>
            </div>
        </div>
    );
}

export default GuideBox;