'use strict';


Template.bridgechannelList.helpers({
  bridgechannel() {
    return Bridgechannel.find({}, { sort: { } } );
  },
  bridgechannelClass(sStatusCode, sPausedCode) {
  },

});

