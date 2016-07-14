'use strict';


Template.channelList.helpers({
  _channel() {
    return Channel.find({}, { sort: { } } );
  },
  channelClass(sStatusCode, sPausedCode) {
  },
});

Template.channelList.events({
  'click #refresh'(event, instance) {
    Meteor.callAction({ action: 'coreshowchannels' });
    //
    // dahdishowchannels returns:
    // Message: Invalid/unknown command: dahdishowchannels. Use Action: ListCommands to show available commands.
    // Meteor.callAction({ action: 'dahdishowchannels' });
  },
});         



