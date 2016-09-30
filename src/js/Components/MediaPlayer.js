/**
 * Created by PedroGaspar on 29/09/2016.
 */

'use strict'

import React, {Component} from 'react';
import {Order, TypeFilter, TimespanCriteria} from '../Enums';
import {sprintf} from '../Utilities/StringUtilities'

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
function whichBaseRoute (timespanCriteria) {
    switch (timespanCriteria) {
        case TimespanCriteria.CREATED:
            return "/media/created/@@0/@@1/@@2/@@3/@@4/@@5";
        case TimespanCriteria.ENGAGED:
            return "/media/@@0/@@1/@@2/@@3/@@4/@@5";
    }
    return "";
}

class MediaPlayer extends Component {
    constructor(props) {
        super(props);
        let sort = this.props.order.split("|");
        this.state = {
            "base-route": whichBaseRoute(this.props["timespan-criteria"]),
            "timespan": this.props.timespan.split("|"),
            "sort-criteria": sort[0],
            "sort-direction": sort[1],
        }
    }


    render () {
        return (
            <div>
                {this.props.order}<br/>
                {this.props["type-filter"]}<br/>
                {this.props["timespan-criteria"]}<br/>
                {sprintf(this.state["base-route"], "123", 3321)}
            </div>
        )
    }
}
MediaPlayer.propTypes = {
    "host": React.PropTypes.string,
    "api-key": React.PropTypes.string.isRequired,
    "collection": React.PropTypes.string.isRequired,
    "order": React.PropTypes.string,
    "timespan": React.PropTypes.string,
    "timespan-criteria": React.PropTypes.string,
    "type-filter": React.PropTypes.string,
    "continuous-scroll": React.PropTypes.bool,
    "load-more-id": React.PropTypes.string,
    "loading-id": React.PropTypes.string,
    "responsive-gridsizes": React.PropTypes.arrayOf(React.PropTypes.number),
    "top-slideshow": React.PropTypes.bool,
    "debug": React.PropTypes.bool
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