'use strict';


import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
          
import './_wbQueueList2.html';


Template.wbQueueList2.helpers({

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
