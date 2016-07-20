"use strict";

import { Template } from 'meteor/templating';
// import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
// import { Session } from 'meteor/session';
import { Session } from 'meteor/session';

import './main.html';


Meteor.callAction = function(msg) {
  console.log('calling clientAction: '+JSON.stringify(msg));
  Meteor.call("clientAction", msg, function (err, res) {
    if (err) {
      console.error('clientAction returned error:' + JSON.stringify(err));
      toaster.show('error', msg.action, JSON.stringify(err));
      return;
    }
    console.log('clientAction returned: '+JSON.stringify(res));
    toaster.show('info', msg.action, JSON.stringify(res)).css("font-size", "10px");
  });

};


var Toaster = function() {
  var self = this;
  //
  // Configure `toastr` object
  // https://github.com/CodeSeven/toastr
  //
  self.init = function(toastr) {
    toastr.options.closeButton = true;
    // toastr.options.closeMethod = 'fadeOut';
    toastr.options.showDuration =
      toastr.options.closeDuration =
        toastr.options.hideDuration = 250;
    // toastr.options.closeEasing = 'swing';
    toastr.options.newestOnTop = false;
    toastr.options.timeOut = 5000;
    // toastr.options.showMethod = 'slideDown';
    // toastr.options.hideMethod = 'slideUp';
    // toastr.options.closeMethod = 'slideUp';
  };

  self.show = function(kind, title, msg) {
    return toastr[ kind ](msg, title).css("width", "500px");
  };

  self.init(window.toastr);

};
var toaster = new Toaster();


var actions = [
  '{'+                                    '\n' +
  '  "action":  "atxfer",'+               '\n' +
  '  "channel": "SIP/200-00000050",'+     '\n' +
  '  "exten":   "203"'+                   '\n' +
  '}' +                                   '\n'
  ,
  '{' +                                   '\n' +
  '  "action":  "redirect",'+             '\n' +
  '  "channel": "SIP/201-00000050",'+     '\n' +
  '  "exten":   "202",'+                  '\n' +
  '  "context": "from_internal",'+        '\n' +
  '  "priority": 1'+                      '\n' +
  '}' +                                   '\n'
  ,
  '{' +                                   '\n' +
  '  "action":  "originate",'+            '\n' +
  '  "channel": "SIP/200",'+              '\n' +
  '  "exten":   "201",'+                  '\n' +
  '  "context": "from_internal",'+        '\n' +
  '  "priority": 1'+                      '\n' +
  '}' +                                   '\n'
  ,
  '{' +                                   '\n' +
  '  "action":  "playdtmf",'+             '\n' +
  '  "channel": "SIP/200-00000050",'+     '\n' +
  '  "digit":   "1"'+                     '\n' +
  '}' +                                   '\n'
  ,
  '{' +                                   '\n' +
  '  "action":  "CoreShowChannels"'+     '\n' +
  '}' +                                   '\n'
  /*
   ami >>> action: {"action":"CoreShowChannels"}
   ami <<< action: CoreShowChannels:  err:undefined, res: {"response":"Success","actionid":"1468006057403","eventlist":"start","message":"Channels will follow"}
   ami <<< action:CoreShowChannels:  err:undefined, res: {
     "response":"Success",
     "actionid":"1468006057403",
     "eventlist":"start",
     "message":"Channels will follow"
   }
   ami <<< managerevent: CoreShowChannel: {
     "event":"CoreShowChannel",
     "actionid":"1468006057403",
     "channel":"SIP/200-000000b7",
     "channelstate":"6",
     "channelstatedesc":"Up",
     "calleridnum":"200",
     "calleridname":"<unknown>",
     "connectedlinenum":"<unknown>",
     "connectedlinename":"<unknown>",
     "accountcode":"",
     "context":"from_internal",
     "exten":"999",
     "priority":"7",
     "uniqueid":"1468006051.351",
     "application":"Queue",
     "applicationdata":"support,tT",
     "duration":"00:00:05",
     "bridgeid":"e1f444df-d00e-4ed0-8ff5-8e4f6e31652e"
   }
   ami <<< managerevent: CoreShowChannel: {
     "event":"CoreShowChannel",
     "actionid":"1468006057403",
     "channel":"SIP/201-000000b8",
     "channelstate":"6",
     "channelstatedesc":"Up",
     "calleridnum":"<unknown>",
     "calleridname":"<unknown>",
     "connectedlinenum":"200",
     "connectedlinename":"<unknown>",
     "accountcode":"",
     "context":"from_internal",
     "exten":"999",
     "priority":"1",
     "uniqueid":"1468006051.352",
     "application":"AppQueue",
     "applicationdata":"(Outgoing Line)",
     "duration":"00:00:05",
     "bridgeid":"e1f444df-d00e-4ed0-8ff5-8e4f6e31652e"
   }                
   ami <<< managerevent: CoreShowChannelsComplete: {
     "event":"CoreShowChannelsComplete",
     "eventlist":"Complete",
     "listitems":"2",
     "actionid":"1468006057403"
   }

   */
  ,
  '{' +                                   '\n' +
  '  "action":  "BridgeInfo",'+            '\n' +
  '  "BridgeUniqueid": "2c3ebab6-7895-406e-ab24-ab3b9061a704"'+ '\n' +
  '}' +                                   '\n'
];
var actionIndex = 0;



/**
 * For $el remove all Bootstrap state classes (like btn-default, btn-primary,... for buttons,
 * label-default,... for labels etc) and add class corresponding to typ and cls values
 * (typ is element type, i.e.  btn or label, cls is
 *
 * @param $el             jQuery element
 * @param {string} typ    element type: btn || label
 * @param {string} cls    status name: default || primary || success || info || warning || danger
 */
function setClass($el, typ, cls) {
  $el.removeClass(
    typ+'-default '+
    typ+'-primary '+
    typ+'-success '+
    typ+'-info '+
    typ+'-warning ' +
    typ+'-danger'
  );
  $el.addClass(typ + '-' + cls);
}


Template.listPages.onCreated(function () {
  Session.set('active-list-page', 'deviceStatusList');
});

Template.listPages.events({
  'click .listPage'(event, instance) {
    var page = event.currentTarget.dataset.page; // `data-page` attribute value
    Session.set('active-list-page', page);
  },
});

Template.listPages.helpers({
  activePage(name) {
    return Session.get('active-list-page') === name;
  },
  pageClass(name) {
    return ( Session.get('active-list-page') === name ) ? 'active' : '';
  },
});


