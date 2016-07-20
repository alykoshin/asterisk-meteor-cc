'use strict';

//
// const WB_REFRESH = 3000;
//
// Template.wbQueueInfo.onCreated(function helloOnCreated() {
//   Meteor.setInterval(function() {
//     Meteor.callAction({ action: 'queuesummary' });
//     Meteor.callAction({ action: 'queuestatus' });
//   }, WB_REFRESH);
// });

// const threshold = {
//   callers: {
//     green: 0,
//     yellow:  5,
//
//   },
// };

import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
          
import './_wbQueueList.html';


Template.wbQueueList.helpers({

  _queues() {
    return Queue.find({}, { sort: { queue: 1 } } );
  },

  _queue(name) {
    return Queue.findOne({ queue: name });
  },

  getClass: Meteor.helpers.getClass,
  getTitle: Meteor.helpers.getTitle,
  getValue: Meteor.helpers.getValue,
});
