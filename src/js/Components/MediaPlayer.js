/**
 * Created by PedroGaspar on 29/09/2016.
 */

'use strict'

import React, {Component} from 'react';
import {Order, TypeFilter, TimespanCriteria} from '../CustomTypes';
import JsApi, {JsApiConf, JsApiOptions} from '../Services/JsApi';
import Realtime from '../Services/Realtime';
import WindowScrollOverflow from '../Utilities/WindowScrollOverflow';
import MediaBox from './MediaBoxes/MediaBox';
import ResponsiveVerticalCollector from './MediaCollectors/ResponsiveVerticalCollector';
import {Loading, FilterBar} from './Common';

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
        this.realtime = this.setupRealtime(this.props["channel"]);
        this.offset = 0;
        this.state = {
            loadmore: false,
            medias: [],
            order: this.props["order"],
            typeFilter: this.props["type-filter"]
        }
    }

    componentDidMount() {
        this.resetGallery();
        this.setScrollListening();
        if(this.props["load-css"]) {
            this.loadCss();
        }
    }

    loadCss () {
        var src = this.props["static-host"] + this.props["css-file"];
        (function() {
            var wf = document.createElement('link');
            wf.href = src;
            wf.type = 'text/css';
            wf.rel = 'stylesheet';
            var links = document.getElementsByTagName('link');
            var s = links[0];
            if (s) {
                s.parentNode.insertBefore(wf, s);
            }
            else {
                var s = document.getElementsByTagName('head')[0];
                s.appendChild(wf);
            }
        })();
    }

    setScrollListening() {
        if (this.props["continuous-scroll"]) {
            WindowScrollOverflow (
                this.refs["gallery-container"],
                this.props["continuous-scroll-threshold"],
                () => this.getGalleryPage()
            );
        }
    }

    getGalleryPage() {
        if(!this.state.loading) {
            this.setState({loading: true});
            this.api.get (this.offset)
                .then(json => {
                    let newState = {};
                    newState.medias = this.state.medias.concat (json.list);
                    newState.lastMediaLoadedCreatedTime = json.list[json.list.length-1].created_time;
                    newState.lastMediaLoadedTotalEngage = json.list[json.list.length-1].total_engage;
                    newState.loading = false;
                    if(!this.props["continuous-scroll"]) {
                        newState.loadmore = true;
                        if (json.offset == this.offset) {
                            newState.loadmore = false;
                        }
                    }
                    this.setState(newState);
                    this.offset = json.offset;
                })
                .catch(json => {
                    if(this.state.debug) {
                        console.log ('Offstage HTTP Error');
                        console.log (json);
                    }
                    this.setState({loading:false});
                });
        }
    }

    resetGallery() {
        this.offset = 0;
        this.setState({medias:[]});
        this.getGalleryPage();
    }

    setupRealtime(channel) {
        const realtime = new Realtime (channel, this.realtimeHandler.bind(this));
        return realtime;
    }

    realtimeHandler (message) {
        switch (m.action) {
            case "new":
                if(this.state.order == Order.TIME) { // only add if sorting by time
                    // validate if not already in medias, it may happen between the user loading the plugin and the socket responding new data, things can come in duplicate
                    if(this.state.typeFilter == TypeFilter.ALL || m.data.type == this.state.typeFilter) {
                        var newMedia = [m.data];
                        this.setState({
                            'medias': newMedia.concat(this.state.medias)
                        });
                    }
                }
                //console.log (m);
                break;
            case "update":
                var updatedData = this.state.medias.slice(); //copy array
                var i=0;
                updatedData.forEach(function (media, index) {
                    if (updatedData[index]._id == m.data._id) {
                        updatedData[index] = m.data;
                        //console.log ("media found and modified");
                    }
                });
                //console.log (m);
                this.setState({medias: updatedData});
                break;
            case "evalActive":
                if(m.data.active == 0) {
                    //if(!this.props.isadmin) {
                    // find and remove
                    var updatedData = this.state.medias.slice(); //copy array
                    var i=0;
                    for(i=0; i < updatedData.length; i++) {
                        if (updatedData[i]._id == m.data._id) {
                            updatedData.splice(i, 1);
                            break;
                        }
                    }
                    this.setState({medias: updatedData});
                    //}
                }
                else {
                    // find, if not present try to insert
                    var updatedData = this.state.medias.slice(); //copy array
                    var i=0, foundPlace = false;
                    for(i=0; i < updatedData.length; i++) {
                        updatedData[i].active = 1;
                        if (updatedData[i]._id == m.data._id) {
                            foundPlace = true;
                            break;
                        }
                        else if (m.data.created_time > updatedData[i].created_time && this.state.order == Order.TIME) {
                            updatedData.splice(i, 0, m.data);
                            foundPlace = true;
                            break;
                        }
                        else if (m.data.total_engage > updatedData[i].total_engage && this.state.sort == Order.ENGAGE) {
                            updatedData.splice(i, 0, m.data);
                            foundPlace = true;
                            break;
                        }
                    }
                    if (!foundPlace) {
                        if (m.data.created_time >= this.state.lastMediaLoadedCreatedTime && this.state.sort == "time") {
                            updatedData.push(m.data);
                        }
                        else if (m.data.total_engage >= this.state.lastMediaLoadedTotalEngage && this.state.sort == "engage") {
                            updatedData.push(m.data);
                        }
                    }
                    //console.log (updatedData[0], m.data);
                    this.setState({medias: updatedData});
                }
                break;
        }
    }

    handleMediaError(mediaId) {
        var i=0;
        for(i=0; i < this.state.medias.length; i++) {
            if (this.state.medias[i]._id == mediaId) {
                var newData = this.state.medias.slice(); //copy array
                newData.splice(i, 1); //remove element
                this.setState({medias: newData}); //update state
                break;
            }
        }
    }

    handleFilter(filterType, value) {
        let optionKey = "";
        switch (filterType) {
            case Order:
                optionKey = "order";
                break;
            case TypeFilter:
                optionKey = "typeFilter";
                break;
        }
        if(optionKey == "") {
            throw new Error("Filter not supported : MediaPlayer:handleFilter " + filterType.toString() + " : " + value);
        }
        let tempState = {};
        tempState[optionKey] = value;
        this.setState(Object.assign(this.state, tempState));
        this.api.setOption (optionKey, value);
        this.resetGallery ();
        return true;
    }

    setFilter (filterType, value) {
        this.handleFilter(filterType, value);
    }

    render() {
        const filterBar = this.props["show-filter-bar"]
                        ? <FilterBar
                            onSelect={this.handleFilter.bind(this)}
                            order={this.state.order}
                            typeFilter={this.state.typeFilter}
                        />
                        : null;
        return (
            <div className="offstage-player">
                <div
                    className="container"
                    ref="gallery-container"
                >
                    {filterBar}
                    <ResponsiveVerticalCollector
                        box={this.props.mediaBox}
                        medias={this.state.medias}
                        toggleactiveroute={""}
                        onError={this.handleMediaError.bind(this)}
                    />
                    <Loading visible={this.state.loading}/>
                </div>
            </div>
        )
    }
}
MediaPlayer.propTypes = {
    "host": React.PropTypes.string,
    "api-key": React.PropTypes.string.isRequired,
    "channel": React.PropTypes.string.isRequired,
    "order": React.PropTypes.oneOf(Order.values()), // Enum Order
    "timespan": React.PropTypes.string, // send timespan to api for time-filtered results
    "timespan-criteria": React.PropTypes.oneOf(TimespanCriteria.values()), // Enum TimespanCriteria: send criteria to api for time-filtered results (CREATED vs ENGAGED during indicated timespan)
    "type-filter": React.PropTypes.oneOf(TypeFilter.values()), // Enum TypeFilter: send filter to api for type-filtered results
    "continuous-scroll": React.PropTypes.bool, // should the player take care of automatic fetch for continuous scrolling
    "continuous-scroll-threshold": React.PropTypes.number, // shall we take into consideration any threshold to validate continuous scroll
    "load-more-id": React.PropTypes.string, // get html element to behave as component
    "loading-id": React.PropTypes.string, // get html element to behave as component
    "responsive-gridsizes": React.PropTypes.arrayOf(React.PropTypes.number), // determines default css behaviour
    "top-slideshow": React.PropTypes.bool, // toggles the appearance of a top slider // TODO: To be implemented yet
    "debug": React.PropTypes.bool, // augments console verbosity
    "mediaBox": React.PropTypes.any,
    "load-css": React.PropTypes.bool,
    "show-filter-bar": React.PropTypes.bool,
    "static-host": React.PropTypes.string,
    "css-file": React.PropTypes.string
}

MediaPlayer.defaultProps = {
    "host": "http://jsapi.off-stage.net",
    "order": Order.TIME,
    "timespan": "0|0",
    "timespan-criteria": TimespanCriteria.CREATED,
    "type-filter": TypeFilter.ALL,
    "continuous-scroll": false,
    "continuous-scroll-threshold": 0,
    "load-more-id": "",
    "loading-id": "",
    "responsive-gridsizes": [1, 2, 3, 4],
    "top-slideshow": false,
    "debug": false,
    "mediaBox": MediaBox,
    "show-filter-bar": true
}

export default MediaPlayer;