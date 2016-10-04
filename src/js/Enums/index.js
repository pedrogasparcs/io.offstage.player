/**
 * Created by PedroGaspar on 29/09/2016.
 */


export const Order = {
    "TIME": "time|-1",
    "TIME_ASC": "time|1",
    "TIME_DESC": "time|-1",
}

export const TypeFilter = {
    "ALL": "all",
    "PHOTOS": "photos",
    "VIDEOS": "videos"
}

export const TimespanCriteria = {
    "CREATED": "created",
    "ENGAGED": "engaged"
}

export default {
    Order,
    TypeFilter,
    TimespanCriteria,
    hasPropertyWithValue: (e, value) => {
        for(let prop in e) {
            if(e[prop] == value) {
                return true;
            }
        }
        return false;
    }
}
