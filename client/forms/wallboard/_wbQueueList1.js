'use strict';


import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';

import './_wbQueueList1.html';


Template.wbQueueList1.helpers({

  _queues() {
    return Queue.find({}, { sort: { queue: 1 } } );
  },

  // _queue(name) {
  //   var q = Queue.findOne({ queue: name })
  //   _.extend(q, { label: QUEUE_LABELS[name] });
  //   console.log('q:', q);
  //   return q;
  // },

  _queueLabel(queueName) {
    return QUEUE_LABELS[queueName];
  },

  getClass: Meteor.helpers.getClass,
  getTitle: Meteor.helpers.getTitle,
  getValue: Meteor.helpers.getValue,
});


Template.wbQueueList1.events({
  'click tr'(event, instance) {
    console.log(event, instance);
    window.location.href = '/wallboard/queue/' + event.currentTarget.dataset['queue'];
  },
});
