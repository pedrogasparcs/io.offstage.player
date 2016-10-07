/**
 * Created by PedroGaspar on 03/10/2016.
 */

'use strict'

import CustomTypes, {
    TimespanCriteria,
    TypeFilter,
    Order,
    Timespan,
    Host,
    ApiKey,
    ApiChannel
} from '../CustomTypes';
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

const apiGet = (config, options) => {
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
        const url = sprintf(config.host + base, start, end, config.channel, options.order, _offset, options.typeFilter);
        return fetch(url, fetchConfig)
            .then( response => {
                return response.json().then(json => {
                    if (json.list && json.list.length) {
                        return json;
                    }
                    return null;
                });
            })
    };
    return get;
};

const configProps = [
    {key: "host", type: Host},
    {key: "key", type: ApiKey},
    {key: "channel", type: ApiChannel}
];

const configOptions = [
    {key: "timespanCriteria", type: TimespanCriteria},
    {key: "timespan", type: Timespan},
    {key: "typeFilter", type: TypeFilter},
    {key: "order", type: Order},
];

const getOption = (coll, key) => {
    for(let option in coll) {
        if (coll[option].key == key) {
            return coll[option];
        }
    }
    return null;
};

// setup helpers
export const JsApiConf = (apiHost, apiKey, apiChannel) => {
    if (!Host.validate(apiHost)) {
        throw new Error ("Wrong ApiHost: invalid");
    }
    if (!ApiKey.validate(apiKey)) {
        throw new Error ("Wrong ApiKey: invalid");
    }
    if (!ApiChannel.validate(apiChannel)) {
        throw new Error ("Wrong ApiChannel: invalid");
    }
    return {
        host: apiHost,
        key: apiKey,
        channel: apiChannel
    };
}

export const JsApiOptions = (timespanCriteria, timespan, typeFilter, order) => {
    if (!TimespanCriteria.validate(timespanCriteria)) {
        throw new Error ("Wrong TimespanCriteria: not available");
    }
    if (!Timespan.validate(timespan)) {
        throw new Error ("Wrong Timespan: invalid format");
    }
    if (!TypeFilter.validate(typeFilter)) {
        throw new Error ("Wrong TypeFilter: not available");
    }
    if (!Order.validate(order)) {
        throw new Error ("Wrong Order: not available");
    }
    return {
        timespanCriteria: timespanCriteria,
        timespan: timespan,
        typeFilter: typeFilter,
        order: order
    };
}

class JsApi {
    constructor (config, options) {
        this.config = config;
        this.options = options;
        this.get = apiGet (this.config, this.options);
    }

    setOption (key, criteria) {
        // validate input
        const option = getOption (configOptions, key);
        if(!option) {
            throw new Error ("Option not available");
        }
        if (!option.type.validate(criteria)) {
            throw new Error ("Wrong " + option.key + ": invalid criteria for option, criteria given: \"" + criteria + "\"");
        }
        // update option at options collection
        let tempOptions = {};
        tempOptions[option.key] = criteria;
        this.options = Object.assign(this.options, tempOptions);
        this.renewMethods();
        // permit chaining
        return this;
    }

    setConfig (key, criteria) {
        // validate input
        const option = getOption (configProps, key);
        if(!option) {
            throw new Error ("Config not available");
        }
        if (!option.type.validate(criteria)) {
            throw new Error ("Wrong " + option.key + ": invalid criteria for config, criteria given: \"" + criteria + "\"");
        }
        // update option at options collection
        let tempOptions = {};
        tempOptions[option.key] = criteria;
        this.config = Object.assign(this.config, tempOptions);
        this.renewMethods();
        // enable chaining
        return this;
    }

    renewMethods () {
        // update options-dependant methods
        this.get = apiGet (this.config, this.options);
    }
}

export default JsApi;