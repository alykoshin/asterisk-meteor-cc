'use strict';


Template.bridgeList.helpers({
  bridge() {
    return Bridge.find({}, { sort: { } } );
  },
  bridgeClass(sStatusCode, sPausedCode) {
  },

});

Template.bridgeList.events({
  'click #refresh'(event, instance) {
    Meteor.callAction({ action: 'bridgelist' });
  },
});
