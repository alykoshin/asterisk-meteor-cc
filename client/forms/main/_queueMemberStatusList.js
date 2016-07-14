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

Template.queueMemberStatusList.helpers({
  queuememberstatus() {
    return Queuememberstatus.find({}, { sort: { queue: 1, stateinterface: 1, membername: 1 } } );
  },
  queuememberstatusText(statusCode) {
    var code; try { code = parseInt(statusCode); } catch(e) { code = 0; }
    return QUEUE_MEMBER_STATUSES[code] && QUEUE_MEMBER_STATUSES[code].text || '';
  },
  queuememberstatusClass(sStatusCode, sPausedCode) {
    // var nStatusCode; try { nStatusCode = parseInt(sStatusCode); } catch(e) { nStatusCode = 0; }
    // var nPausedCode; try { nPausedCode = parseInt(sPausedCode); } catch(e) { nPausedCode = 0; }
    var cls1 = QUEUE_MEMBER_STATUSES[sStatusCode] && QUEUE_MEMBER_STATUSES[sStatusCode].class || 'default';
    var cls2 = QUEUE_MEMBER_PAUSE_CODES[sPausedCode] || '';
    return cls1+' '+cls2;
  },

});

Template.queueMemberStatusList.events({
  'click #refresh'(event, instance) {
    Meteor.callAction({ action: 'queuestatus' });
  },
});

