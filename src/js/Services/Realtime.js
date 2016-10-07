/**
 * Created by PedroGaspar on 29/09/2016.
 */

var PubNub = require('pubnub');

const setupSocket = () => {
    const socket = new PubNub({
        publishKey: 'pub-c-604f5be8-9bb9-4f56-b231-12f6ff777be1',
        subscribeKey: 'sub-c-8ec148cc-684b-11e5-839c-02ee2ddab7fe'
    });
    return socket;
}

const setupPubNubSubscription = (socket, channel, updatesCallback) => {
    socket.subscribe({
        channel: channel,
        message: (m) => {
            //console.log (m);
            /*
             if(m.datatype == "action") {
             //console.log (m.data);
             ref.actionsQueue.push (m.data);
             ref.evaluateState (); // added last version to void two cycles
             }
             else if (m.datatype == "media") {
             //console.log (m.data);
             ref.parseData (m.data);
             }
             */
            updatesCallback (m);
        }
    });
}

class Realtime {
    constructor (channel, updatesCallback) {
        this.socket = setupSocket();
        setupPubNubSubscription(this.socket, channel, updatesCallback);
    }
}

export default Realtime;