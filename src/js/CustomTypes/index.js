/**
 * Created by PedroGaspar on 29/09/2016.
 */


export const Order = {
    "TIME": "time|-1",
    "TIME_ASC": "time|1",
    "TIME_DESC": "time|-1",
    validate: value => enumDefault.hasPropertyWithValue(Order, value)
}

export const TypeFilter = {
    "ALL": "all",
    "PHOTOS": "photos",
    "VIDEOS": "videos",
    validate: value => enumDefault.hasPropertyWithValue(TypeFilter, value)
}

export const TimespanCriteria = {
    "CREATED": "created",
    "ENGAGED": "engaged",
    validate: value => enumDefault.hasPropertyWithValue(TimespanCriteria, value)
}

export const Timespan = {
    validate: value => {
        return true;
    }
}

const typesDefault = {
    Order,
    TypeFilter,
    TimespanCriteria,
    Timespan,
    hasPropertyWithValue: (e, value) => {
        for(let prop in e) {
            if(e[prop] == value && prop != "validate") {
                return true;
            }
        }
        return false;
    }
};
export default typesDefault;
