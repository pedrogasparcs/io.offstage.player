/**
 * Created by PedroGaspar on 03/10/2016.
 */

'use strict'

import Enum, {TimespanCriteria, TypeFilter, Order} from '../Enums';
import {sprintf} from '../Utilities/StringUtilities';


function whichBaseRoute (timespanCriteria) {
    switch (timespanCriteria) {
        case TimespanCriteria.CREATED:
            return "/media/created/@@0/@@1/@@2/@@3/@@4/@@5";
        case TimespanCriteria.ENGAGED:
            return "/media/@@0/@@1/@@2/@@3/@@4/@@5";
    }
    return "";
}

function apiGet (config, options) {
    const base = whichBaseRoute(options.timespanCriteria);
    const timeParts = options.timespan.split(",");
    const start = timeParts[0];
    const end = timeParts[1];

    const fetchHeaders = new Headers();
    const fetchConfig = {
        method: 'GET',
        headers: fetchHeaders,
        mode: 'cors',
        cache: 'default'
    };

    const get = (offset) => {
        const _offset = !offset?0:offset;
        if (isNaN(_offset) || _offset < 0) {
            throw new Error ("Wrong offset");
        }
        const url = sprintf(base, start, end, config.channel)
        fetch(url, fetchConfig)
            .then(function(response) {
                console.log (response);
                return response.blob();
            })
            .then(function(myBlob) {
                /*
                var objectURL = URL.createObjectURL(myBlob);
                myImage.src = objectURL;
                */
                console.log (myBlob);
            });
    };
    return get;

}

class JsApi {
    constructor (config, options) {
        this.config = config;
        this.options = options;
        this.get = apiGet (this.config, this.options);
    }

    setTimespanCriteria (criteria) {
        // validate input
        if (!Enum.hasPropertyWithValue(TimespanCriteria, criteria)) {
            throw new Error ("Wrong Timespan Criteria: not available");
        }
        // update option
        this.options = Object.assign(this.options, {timespanCriteria: criteria});
        // update options-dependant
        this.get = apiGet (this.config, this.options);
        // permit chaining
        return this;
    }
}

export default JsApi;

export const JsApiConf = (apiHost, apiKey, apiChannel) => {
    return {
        host: apiHost,
        key: apiKey,
        channel: apiChannel
    };
}

export const JsApiOptions = (timespanCriteria, timespan, typeFilter, order) => {
    if (!Enum.hasPropertyWithValue(TimespanCriteria, timespanCriteria)) {
        throw new Error ("Wrong TimespanCriteria: not available");
    }
    if (!Enum.hasPropertyWithValue(TypeFilter, typeFilter)) {
        throw new Error ("Wrong TypeFilter: not available");
    }
    if (!Enum.hasPropertyWithValue(Order, order)) {
        throw new Error ("Wrong Order: not available");
    }
    return {
        timespanCriteria: timespanCriteria,
        timespan: timespan,
        typeFilter: typeFilter,
        order: order
    };
}