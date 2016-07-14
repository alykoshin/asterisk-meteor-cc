'use strict';


const PEER_STATE_CLASSES = {
  'unknown':      'default',
  'registered':   'success',
  'unregistered': 'info',
  'rejected':     'danger',
  'lagged':       'warning',
};

Template.peerStatusList.helpers({
  _peerstatus() { // same as its property
    return Peerstatus.find({}, { sort: { peer: 1 } });//.fetch();
  },
  peerstatusClass(statusText) {
    return PEER_STATE_CLASSES[statusText.toLowerCase()] || 'default';
  },
});

Template.peerStatusList.events({
  'click #refresh'(event, instance) {
    Meteor.callAction({ action: 'sippeerstatus' });
  },
});

