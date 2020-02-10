import React from 'react';

import Chart from './Chart'

function Weekly(props) {
    return (
        <div className="weekly content-box">
            <div className="content-box header">
                <h1>This Week in Seismology</h1>
            </div>
            <div className="content-box body">
                <Chart type="line" history={props.history}></Chart>
                <Chart type="hist" history={props.history}></Chart>
                <Chart type="bubble" history={props.history}></Chart>
            </div>
        </div>
    );
}

export default Weekly;