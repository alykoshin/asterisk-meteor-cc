'use strict';


Template.channelVarList.helpers({
  _channelvar() {
    return Channelvar.find({}, { sort: { } } );
  },
  channelvarClass(sStatusCode, sPausedCode) {
  },
  // _variable() {
  //   // {"event":"VarSet",...,"variable":{"readstatus":""},"value":"TIMEOUT"}
  //   return typeof this.variable === 'object' ? Object.keys(this.variable)[0] : this.variable;
  // },

});




