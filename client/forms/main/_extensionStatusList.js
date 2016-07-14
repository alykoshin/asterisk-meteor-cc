'use strict';


Template.extensionStatusList.EXTENSION_STATE_CLASSES = {
  'idle':          'success',
  'inuse':         'info',
  'busy':          'info',
  'unavailable':   'default',
  'ringing':       'danger',
  'inuse&ringing': 'danger',
  'hold':          'warning',
  'inuse&hold':    'warning',
  'unknown':       'default'
};

Template.extensionStatusList.helpers({
  extensionstatus() {
    return Extensionstatus.find({}, { sort: { context: 1, exten: 1 }});
  },
  extensionstatusClass(statusText) {
    return Template.extensionStatusList.EXTENSION_STATE_CLASSES[statusText.toLowerCase()] || 'default';
  },
});

Template.extensionStatusList.events({
  'click #refresh'(event, instance) {
    Meteor.callAction({ action: 'extensionstatelist' });
  },
});

