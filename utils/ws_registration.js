// ==================================
//  incoming messages, look for type
// ==================================
var ibc = {};
var chaincode = {};
var async = require('async');

module.exports.setup = function(sdk, cc) {
    ibc = sdk;
    chaincode = cc;
};

module.exports.process_msg = function(ws, data) {
    if (data.v === 1) { //only look at messages for registration
        if (data.type == 'create') {
            console.log('its a create!');
            if (data.name && data.adhaar_no && data.survey_no && data.location && data.area) {
                chaincode.invoke.register([data.name, data.adhaar_no, data.survey_no, data.location, data.area], cb_invoked); //create a new property
                
            }
        } else if (data.type == 'transfer') {
            console.log('its a transfer!');
            if (data.name && data.survey_no && data.new_name) {
                console.log('invoking transfer!');
                chaincode.invoke.transfer([data.survey_no, data.name, data.new_name], cb_invoked); //create a new property
            }
        } else if (data.type == 'get') {
            console.log('get property msg');
            chaincode.query.read(['_propertyindex'], cb_got_index);
        } else if (data.type == 'chainstats') {
            console.log('chainstats msg');
            ibc.chain_stats(cb_chainstats);
        }
    }

    //got the property index, lets get each property
    function cb_got_index(e, index) {
        if (e != null) console.log('[ws error] did not get property index:', e);
        else {
            try {
                var json = JSON.parse(index);
                var keys = Object.keys(json);
                var concurrency = 1;

                //serialized version
                async.eachLimit(keys, concurrency, function(key, cb) {
                    console.log('!', json[key]);
                    chaincode.query.read([json[key]], function(e, property) {
                        if (e != null) console.log('[ws error] did not get property:', e);
                        else {
                            if (property) sendMsg({ msg: 'properties', e: e, property: JSON.parse(property) });
                            cb(null);
                        }
                    });
                }, function() {
                    sendMsg({ msg: 'action', e: e, status: 'finished' });
                });
            } catch (e) {
                console.log('[ws error] could not parse response', e);
            }
        }
    }

    function cb_invoked(e, a) {
        console.log('response: ', e, a);
    }

    //call back for getting the blockchain stats, lets get the block stats now
    function cb_chainstats(e, chain_stats) {
        if (chain_stats && chain_stats.height) {
            chain_stats.height = chain_stats.height - 1; //its 1 higher than actual height
            var list = [];
            for (var i = chain_stats.height; i >= 1; i--) { //create a list of heights we need
                list.push(i);
                if (list.length >= 8) break;
            }
            list.reverse(); //flip it so order is correct in UI
            async.eachLimit(list, 1, function(block_height, cb) { //iter through each one, and send it
                ibc.block_stats(block_height, function(e, stats) {
                    if (e == null) {
                        stats.height = block_height;
                        sendMsg({ msg: 'chainstats', e: e, chainstats: chain_stats, blockstats: stats });
                    }
                    cb(null);
                });
            }, function() {});
        }
    }

    //send a message, socket might be closed...
    function sendMsg(json) {
        if (ws) {
            try {
                ws.send(JSON.stringify(json));
            } catch (e) {
                console.log('[ws error] could not send msg', e);
            }
        }
    }
};