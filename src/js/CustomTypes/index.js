/**
 * Created by PedroGaspar on 29/09/2016.
 */

const hasPropertyWithValue = (e, value) => {
    for(let prop in e) {
        if(e[prop] == value && prop != "validate") {
            return true;
        }
    }
    return false;
}

const validKeys = e => {
    let result = [];
    for(let prop in e) {
        if (typeof e[prop] != 'function') {
            result.push(e[prop]);
        }
    }
    return result;
}

export const Order = {
    "TIME": "time",
    "TIME_ASC": "time_ascending",
    "TIME_DESC": "time",
    "LAST_TIME": "last_time", // applicable for users
    "LAST_TIME_ASC": "last_time_ascending", // applicable for users
    "LAST_TIME_DESC": "last_time", // applicable for users
    "CONTRIBUTIONS": "contributions", // applicable for users
    "ENGAGE": "engage",
    "LIKES": "likes",
    "COMMENTS": "comments",
    validate: value => hasPropertyWithValue(Order, value),
    values: () => validKeys(Order)
}

export const TypeFilter = {
    "ALL": "all",
    "PHOTOS": "photo",
    "VIDEOS": "video",
    validate: value => hasPropertyWithValue(TypeFilter, value),
    values: () => validKeys(TypeFilter)
}

export const TimespanCriteria = {
    "CREATED": "created",
    "ENGAGED": "engaged",
    validate: value => hasPropertyWithValue(TimespanCriteria, value),
    values: () => validKeys(TimespanCriteria)
}

export const Timespan = {
    validate: value => {
        return true;
    }
}

export const Host = {
    validate: value => {
        return true;
    }
}

export const ApiKey = {
    validate: value => {
        return true;
    }
}

export const ApiChannel = {
    validate: value => {
        return true;
    }
}

const typesDefault = {
    Order,
    TypeFilter,
    TimespanCriteria,
    Timespan,
    Host,
    ApiKey,
    ApiChannel,
    hasPropertyWithValue
};
export default typesDefault;
