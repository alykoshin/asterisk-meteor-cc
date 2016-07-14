"use strict";


import { Meteor } from 'meteor/meteor';


function emitRaw(eventName, data) {
  const ACTION_TIMEOUT = 5000;
  
  // dispatcher.wrappedEmit = Meteor.wrapAsync(dispatcher.emit);
  dispatcher.wrappedEmit = Meteor.wrapAsync(function(eventName, msg, cb) {
    var tim;
    
    tim = Meteor.setTimeout(function() {
      // throw new Meteor.Error("actionError", "emitRaw(): clientAction timeout, eventName: "+data.action);
      var err = new Meteor.Error("actionError", "emitRaw(): clientAction timeout, eventName: "+eventName);
      cb(err);
    }, ACTION_TIMEOUT);
    
    // dispatcher.emit.call(this, msg, function(err,data) {
    dispatcher.emit(eventName, msg, function(err, res) {
      Meteor.clearTimeout(tim);
      cb(err, res);
    });
    
  });

  var intEventName = 'ws:' + eventName;
  if (dispatcher.listeners(intEventName).length === 0) {
    throw new Meteor.Error("actionError", "emitRaw(): No listeners defined at dispatcher, eventName: "+intEventName);
  }

  var res;
  // var tim;
  // tim = Meteor.setTimeout(function() {
  //   throw new Meteor.Error("actionError", "emitRaw(): clientAction timeout, eventName: "+data.action);
  // }, ACTION_TIMEOUT);

  try {

    res = dispatcher.wrappedEmit(intEventName, data);

    // if (eventName === 'sippeerstatus') { console.log('!!!! done'); }

  } catch(e) {
    console.log('catch: e:' + JSON.stringify(e));
    throw new Meteor.Error("actionError", "emitRaw(): clientAction returned error, eventName: " + eventName, JSON.stringify(e));
  }
  return res;
}


Meteor.methods({                         
  
  clientAction: function (data) {
    console.log('Meteor.methods(): clientAction: actionData: '+JSON.stringify(data));
    // check(arg1, String);
    // check(arg2, [Number]);
    return emitRaw(data.action, data);
  },

  clientRawAction: function (data) {
    console.log('Meteor.methods(): clientRawAction: actionData: '+JSON.stringify(data));
    // check(arg1, String);
    // check(arg2, [Number]);
    return emitRaw('raw', data);
  },

});
