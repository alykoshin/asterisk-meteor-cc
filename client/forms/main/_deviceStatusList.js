'use strict';


var DEVICE_STATE_CLASSES = {
  'INUSE':         'info',
  'BUSY':          'info',
  'UNAVAILABLE':   'default',
  'RINGING':       'danger',
  'RINGINUSE':     'danger',
  'ONHOLD':        'warning',
  'INVALID':       'default',
  'NOT_INUSE':     'success',
  'UNKNOWN':       'default'
};

Template.deviceStatusList.helpers({
  devicestatus() {
    return Devicestatus.find({}, { sort: { device: 1 } });
  },
  devicestatusClass(statusText) {
    return DEVICE_STATE_CLASSES[statusText.toUpperCase()] || 'default';
  },
});

Template.deviceStatusList.events({
  'click #refresh'(event, instance) {
    Meteor.callAction({ action: 'devicestatelist' });
  },
});
