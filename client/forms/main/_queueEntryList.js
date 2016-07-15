'use strict';


var QUEUE_MEMBER_STATUSES = {
  '0': { text: 'AST_DEVICE_UNKNOWN',     class: 'default' },
  '1': { text: 'AST_DEVICE_NOT_INUSE',   class: 'success' },
  '2': { text: 'AST_DEVICE_INUSE',       class: 'info'    },
  '3': { text: 'AST_DEVICE_BUSY',        class: 'info'    },
  '4': { text: 'AST_DEVICE_INVALID',     class: 'default' },
  '5': { text: 'AST_DEVICE_UNAVAILABLE', class: 'default' },
  '6': { text: 'AST_DEVICE_RINGING',     class: 'danger'  },
  '7': { text: 'AST_DEVICE_RINGINUSE',   class: 'danger'  },
  '8': { text: 'AST_DEVICE_ONHOLD',      class: 'warning' },
};

var QUEUE_MEMBER_PAUSE_CODES = {
  '0': '',
  '1': 'paused'
};

Template.queueEntryList.helpers({
  queueentry() {
    return Queueentry.find({}, { sort: { queue: 1, channel: 1 } } );
  },
});

Template.queueEntryList.events({
  'click #refresh'(event, instance) {
    Meteor.callAction({ action: 'queuestatus' });
  },
});

