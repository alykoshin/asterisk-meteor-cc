'use strict';


Template.queueList.helpers({
  _queue() {
    return Queue.find({}, { sort: { queue: 1 } } );
  },
   queueClass(sStatusCode, sPausedCode) {
     
   }
});


Template.queueList.events({
  'click #refresh'(event, instance) {
    Meteor.callAction({ action: 'queuesummary' });
    Meteor.callAction({ action: 'queuestatus'  });
  },
});

