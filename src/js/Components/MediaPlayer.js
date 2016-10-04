/**
 * Created by PedroGaspar on 29/09/2016.
 */

'use strict'

import React, {Component} from 'react';
import {Order, TypeFilter, TimespanCriteria} from '../Enums';
import JsApi, {JsApiConf, JsApiOptions} from '../Services/JsApi';

/**
 * Private Methods
 */

/**
 *
 * Decide which base route shall be used to query API for new Media
 *
 * @param timespanCriteria
 * @returns {*}
 */

class MediaPlayer extends Component {
    constructor(props) {
        super(props);
        this.api = new JsApi(
            new JsApiConf (
                this.props["host"],
                this.props["api-key"],
                this.props["channel"]
            ),
            new JsApiOptions (
                this.props["timespan-criteria"],
                this.props["timespan"],
                this.props["type-filter"],
                this.props["order"],
            )
        );
    }

    componentDidMount () {
        this.api.get ();
    }

    render () {
        return (
            <div>
                {this.props.order}<br/>
                {this.props["type-filter"]}<br/>
                {this.props["timespan-criteria"]}<br/>
            </div>
        )
    }
}
MediaPlayer.propTypes = {
    "host": React.PropTypes.string,
    "api-key": React.PropTypes.string.isRequired,
    "channel": React.PropTypes.string.isRequired,
    "order": React.PropTypes.string, // Enum Order
    "timespan": React.PropTypes.string, // send timespan to api for time-filtered results
    "timespan-criteria": React.PropTypes.string, // Enum TimespanCriteria: send criteria to api for time-filtered results (CREATED vs ENGAGED during indicated timespan)
    "type-filter": React.PropTypes.string, // Enum TypeFilter: send filter to api for type-filtered results
    "continuous-scroll": React.PropTypes.bool, // should the player take care of automatic fetch for continuous scrolling
    "load-more-id": React.PropTypes.string, // get html element to behave as component
    "loading-id": React.PropTypes.string, // get html element to behave as component
    "responsive-gridsizes": React.PropTypes.arrayOf(React.PropTypes.number), // determines default css behaviour
    "top-slideshow": React.PropTypes.bool, // toggles the appearance of a top slider
    "debug": React.PropTypes.bool // augments console verbosity
}

MediaPlayer.defaultProps = {
    "host": "http://jsapi.codfeesh.com",
    "order": Order.TIME,
    "timespan": "0|0",
    "timespan-criteria": TimespanCriteria.CREATED,
    "type-filter": TypeFilter.ALL,
    "continuous-scroll": false,
    "load-more-id": "",
    "loading-id": "",
    "responsive-gridsizes": [1, 2, 3, 4],
    "top-slideshow": false,
    "debug": false
}

export default MediaPlayer;