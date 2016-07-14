/**
 * Created by alykoshin on 28.06.16.
 */

/* globals Temp, Devicestatus, Extensionstatus, Peerstatus, Queue, Queuememberstatus, Channel, Bridge, Bridgechannel, Channelvar,
 Meteor, dispatcher
 */

'use strict';

const util = require('util');
const debug = require('debug')('ami');
// const debug = console.log;
// const debug_row = console.log;
const debug_row = require('debug')('raw');
const chalk = require('chalk');
const AsteriskManager = require('asterisk-manager');

const amiConfig = {
  host: '172.20.200.1',
  port: '5038',
}
// var dispatcher = require('./dispatcher');
// var credentials = require('../credentials.json');
const credentials = {
  "_ami": {
    "username": "admin_user",
    "password": "mkefiei303"
  },
  "ami": {
    "username": "hello",
    "password": "kfd38ne98lfd"
  }
};


// const EventEmitter = require('events');
// const chalk = require('chalk');
// const debug = console.log;//equire('debug')('dispatcher');
// const _ = require('underscore');

//


Meteor.startup(() => {
  Meteor.cleanup();
  Meteor.startAMI();
});

var ami;


Meteor.startAMI = function() {

  console.log('>>> Connecting to AMI...');
  debug('>>> '+chalk.yellow('Connecting'));

// var ami = new AsteriskManager('5038','localhost','hello','world', true);
  ami = new AsteriskManager(
    amiConfig.port, //'5038',
    // '178.57.222.131',
    amiConfig.host, //'localhost',
    credentials.ami.username,
    credentials.ami.password,
    true
  );

  ami.keepConnected();


  ami.__action = ami.action;
  ami._action = function(msg, callback) {
    ami.__action.apply(this, arguments);
    // ami.__action(msg, callback);
  };

  ami.action = function(msg, callback) {
    var args = Array.prototype.slice.call(arguments);
    debug(chalk.green('==> action: ' + JSON.stringify(args[0])));

    ami._action(msg, function(err,res) {

      if (err) {
        debug('<== '+chalk.green('action: '+msg.action)+': ' +
          ' err:' + chalk.red(JSON.stringify(err)) + '');
        return callback(err);
      }
      debug('<== '+chalk.green('action: '+msg.action)+': ' +
        'res: ' + JSON.stringify(res));
      return callback(err, res);

    });

  };


  ami.actionComplete = function(msg, completeEventName, callback) {
    // debug(chalk.green('==> actionComplete: ' + JSON.stringify(msg)+', completeEventName (lowercase): '+completeEventName)+', typeof callback: ' + typeof callback);
    // debug(chalk.green('==> arguments.length: ' + arguments.length+', typeof callback: ',typeof callback));

    if (arguments.length < 3) {
      if (arguments.length === 2) {
        callback          = completeEventName;
      }
      completeEventName = msg.action + 'Complete';
    }
    completeEventName = completeEventName.toLowerCase();
    callback = (typeof callback === 'function') ? callback : function() {};

    // debug(chalk.green('==> actionComplete: ' + JSON.stringify(msg)+', completeEventName (lowercase): '+completeEventName)/*+', callback: ',callback*/);
    // debug(chalk.green('>>> arguments.length: ' + arguments.length+', typeof callback: ',typeof callback));

    // if (typeof completeEvents === 'string') { completeEvents = [completeEvents]; }

    debug(chalk.green('==> actionComplete: ' + JSON.stringify(msg)));

    ami._action(msg, function(err, res) {
      var data = [];
      var timer = null;

      var cleanup = function() {
        ami.removeListener('managerevent', onManagerEvent);
        if (timer) {
          // console.log('*** '+msg.action+' timer off: ',timer);
          clearTimeout(timer);
          timer = null;
        }
      };

      var onManagerEvent = function(evt) {
        // console.log('actionComplete(): onManagerEvent event: '+evt.event+', actionid: '+evt.actionid);
        if (evt.actionid !== res.actionid) {
          return;
        }
        var thisEventName = evt.event && evt.event.toLowerCase();
        if (completeEventName === thisEventName ) {
          cleanup();
          // debug('actionComplete: completeEventName');
          if (err) {
            debug('<== ' + chalk.white.bold('actionComplete: '+msg.action+': response') + ': ' +
              chalk.red(' err: ' + JSON.stringify(err)) + ''
            );
            return callback(err);
          }
          debug('<== ' + chalk.white.bold('actionComplete: '+msg.action+': response') + ': ' +
            ', data: ' + JSON.stringify(data) +
            ', response: ' + JSON.stringify(res) +
            ', complete: ' + JSON.stringify(evt)
          );
          return callback(undefined, data, res, evt);
        }
        data.push(evt);
      };

      if (err) {
        return callback(err);
      }

      var ACTION_LIST_TIMEOUT = 3000;
      timer = setTimeout(function() {
        cleanup();
        var err = 'No complete message in ' + ACTION_LIST_TIMEOUT + ' mseconds; action: '+msg.action+', actionid: '+res.actionid;
        // console.log('>>> '+chalk.green('action: agents: agentscomplete')+': ' +
        //   chalk.red(' err: ' + err) + ' actionid: '+res.actionid );
        callback(err);
      }, ACTION_LIST_TIMEOUT);
      // console.log('*** '+msg.action+' timer on: ',timer);

      ami.on('managerevent', onManagerEvent);

    });

  };

  ami.on('fullybooted', function() {
    onAMIReady();
  });

  ami.on('connect', function() {
    debug('<<< '+chalk.yellow('connect'));
  });

  ami.on('close', function(evt) {
    debug('<<< '+chalk.yellow('close') + chalk.grey(': '+JSON.stringify(evt)));
  });

  ami.on('end', function(evt) {
    debug('<<< '+chalk.yellow('end') + chalk.grey(': '+JSON.stringify(evt)));
  });

  ami.on('data', function(evt) {
    debug('<<< '+chalk.yellow('data') + chalk.grey(': '+JSON.stringify(evt)));
  });

  ami.on('error', function(evt) {
    debug('<<< '+chalk.red('error') + chalk.grey(': '+JSON.stringify(evt)));
  });


  ami.on('rawevent', function(evt) {
    debug_row('<<< '+chalk.yellow('rawevent') + chalk.grey(': '+JSON.stringify(evt)));
  });


  ami.on('asterisk', function(evt) {
    debug_row('<<< '+chalk.yellow('asterisk') + chalk.grey(': '+JSON.stringify(evt)));
  });


  // Listen for any/all AMI events.
  ami.on('managerevent', function(evt) {
    var msg = evt.event;
    if (evt.event !== 'RTCPReceived' && evt.event !== 'RTCPSent') {
      msg += chalk.grey(': '+JSON.stringify(evt) );
    } else {
      msg += chalk.grey(': '+' { ... }');
    }
    dispatcher.publish('ami', evt);

    debug('<-- '+'managerevent: ' + msg);

    // console.log unhandled events
    if (ami.listeners(evt.event.toLowerCase()).length === 0) {
      console.log(evt.event);
    }
  });


  ami.wrappedOn = Meteor.wrapAsync(ami.on);

  //

  ami.wrappedOn('devicestatechange', function(evt) {
    Devicestatus.upsert({ device: evt.device }, evt);
  });

  //

  ami.wrappedOn('extensionstatus', function(evt) {
    Extensionstatus.upsert({ context: evt.context, exten: evt.exten }, evt);
  });

  //

  ami.wrappedOn('peerstatus', function(evt) {
    Peerstatus.upsert({ peer: evt.peer }, evt);
  });

  //

  //ChallengeSent SuccessfulAuth

  //

  ami.wrappedOn('queuememberstatus', function(evt) {
    Queuememberstatus.upsert({ queue: evt.queue, stateinterface: evt.stateinterface }, evt);
    // delayedRefreshQueues();
  });

  ami.wrappedOn('queuemember', function(evt) {
    Queuememberstatus.upsert({ queue: evt.queue, stateinterface: evt.stateinterface }, evt);
    // delayedRefreshQueues(); // results in loop
  });

  ami.wrappedOn('queuememberpause', function(evt) {
    Queuememberstatus.upsert({ queue: evt.queue, stateinterface: evt.stateinterface }, evt);
    delayedRefreshQueues();
  });

  ami.wrappedOn('queuememberadded', function(evt) {
    Queuememberstatus.upsert({ queue: evt.queue, stateinterface: evt.stateinterface }, evt);
    delayedRefreshQueues();
  });

  ami.wrappedOn('queuememberremoved', function(evt) {
    Queuememberstatus.remove({ queue: evt.queue, stateinterface: evt.stateinterface });
    delayedRefreshQueues();
  });

   ami.wrappedOn('agentcomplete', function(evt) {
    Queuememberstatus.remove({ queue: evt.queue, stateinterface: evt.stateinterface });
    delayedRefreshQueues();
  });

  //

  ami.wrappedOn('coreshowchannel', function(evt) {
    Channel.upsert({ channel: evt.channel }, evt);
  });

  ami.wrappedOn('newchannel', function(evt) {
    Channel.upsert({ channel: evt.channel }, evt);
  });

  ami.wrappedOn('newstate', function(evt) {
    Channel.upsert({ channel: evt.channel }, evt);
  });

  ami.wrappedOn('newconnectedline', function(evt) {
    Channel.upsert({ channel: evt.channel }, evt);
  });

  ami.wrappedOn('newexten', function(evt) {
    Channel.upsert({ channel: evt.channel }, evt);
  });

  ami.wrappedOn('dialend', function(evt) {
    Channel.upsert({ channel: evt.channel }, evt);
  });

  const CHANNELVAL_CLEANUP_TIMEOUT = 250;
  ami.wrappedOn('hangup', function(evt) {
    Channel.remove({ channel: evt.channel });
    // `hangup` comes immediately after last `varset`
    // and sometime upsert happens after `hangup` (while all original varset messages are before hangup)
    // so we need to wait a bit before removing data from `Channelvar`
    Meteor.setTimeout(function() {
      Channelvar.remove({ channel: evt.channel });
    }, CHANNELVAL_CLEANUP_TIMEOUT);
  });

  ami.wrappedOn('hanguprequest', function(evt) {
    Channel.upsert({ channel: evt.channel }, evt);
  });

  ami.wrappedOn('softhanguprequest', function(evt) {
    Channel.upsert({ channel: evt.channel }, evt);
  });

  //

  ami.wrappedOn('varset', function(evt) {
    // {"event":"VarSet",...,"variable":{"readstatus":""},"value":"TIMEOUT"}
    evt._variable = typeof evt.variable === 'object' ? Object.keys(evt.variable)[0] : evt.variable;
    Channelvar.upsert({ channel: evt.channel, _variable: evt._variable }, evt);
  });

  //

  ami.wrappedOn('queueparams', function(evt) {
    var $set = {};
    for (var name in evt) { if (evt.hasOwnProperty(name)) {
      $set[name] = evt[name  ];
    }}
    Queue.upsert({ queue: evt.queue }, { $set: $set }, evt);
  });

  ami.wrappedOn('queuesummary', function(evt) {
    var $set = {};
    for (var name in evt) { if (evt.hasOwnProperty(name)) {
      $set[name] = evt[name  ];
    }}
    Queue.upsert({ queue: evt.queue }, { $set: $set }, evt);
    // Queue.upsert({ queue: evt.queue, event: evt.event }, evt);
  });

  //

  ami.wrappedOn('queuecallerjoin', function(evt) {
    // Channel.upsert({ channel: evt.channel }, evt);
    delayedRefreshQueues();
  });

  ami.wrappedOn('queuecallerleave', function(evt) {
    // Channel.upsert({ channel: evt.channel }, evt);
    delayedRefreshQueues();
  });

  ami.wrappedOn('queuecallerabandon', function(evt) {
    // Channel.upsert({ channel: evt.channel }, evt);
    delayedRefreshQueues();
  });

  //

  ami.wrappedOn('agentconnect', function(evt) {
    // Channel.upsert({ channel: evt.channel }, evt);
    delayedRefreshQueues();
  });

  //

  ami.wrappedOn('bridgecreate', function(evt) {
    Bridge.upsert({ bridgeuniqueid: evt.bridgeuniqueid }, evt);
  });

  ami.wrappedOn('bridgedestroy', function(evt) {
    Bridge.remove({ bridgeuniqueid: evt.bridgeuniqueid });
  });

  ami.wrappedOn('bridgeenter', function(evt) {
    Bridge.update(
      { bridgeuniqueid:    evt.bridgeuniqueid }, //, uniqueid: evt.uniqueid },
      { bridgenumchannels: evt.bridgenumchannels, }
    );
    Bridgechannel.upsert({ bridgeuniqueid: evt.bridgeuniqueid, uniqueid: evt.uniqueid}, evt); //channel: evt.channel }, evt);//, uniqueid: evt.uniqueid },
  });

  ami.wrappedOn('bridgeleave', function(evt) {
    Bridge.update(
      { bridgeuniqueid:    evt.bridgeuniqueid },//, uniqueid: evt.uniqueid },
      { bridgenumchannels: evt.bridgenumchannels, }
    );
    Bridgechannel.remove({ bridgeuniqueid: evt.bridgeuniqueid, uniqueid: evt.uniqueid }); // channel: evt.channel });
  });



  // ami.wrappedOn('confbridgejoin', function(evt) {
  //   debug('<<< '+chalk.blue('confbridgejoin ') + chalk.grey(': ' + JSON.stringify(evt)));
  // });


  // Listen for Action responses.
  // ami.wrappedOn('response', function(evt) {
  //   debug('<<< '+chalk.blue('response ') + chalk.grey(': ' + JSON.stringify(evt)));
  // });

  // Perform an AMI Action. A list of actions can be found at
  // https://wiki.asterisk.org/wiki/display/AST/Asterisk+11+AMI+Actions
  // ami.action({
  //   'action': 'originate',
  //   'channel': 'SIP/200',
  //   // 'context': 'default',
  //   'context': 'from_internal',
  //   'exten': 200,
  //   'priority': 1,
  //   'async': true,
  //   'variable': {
  //     'name1': 'value1',
  //     'name2': 'value2'
  //   }
  // }, function(err, res) {
  //   console.log('>>> '+chalk.green('action: originate')+': ' +
  //     ' err:' + chalk.red(JSON.stringify(err)) + '' +
  //     ', res: ' + JSON.stringify(res));
  // });

  dispatcher.on('ws:originate', function(data, callback) {
    var msg = {
      'action': 'originate',
      'channel':  data.device,
      'exten':  data.phone2,
    };
    ami.action(msg, function (err, res) {
      callback(err, res);
    });
  });


  dispatcher.on('ws:corestatus', function(data, callback) {
    var msg = {
      'action': 'CoreStatus',
    };
    ami.action(msg, function (err, res) {
      callback(err, res);
    });
  });


  dispatcher.on('ws:extensionstate', function(data, callback) {
    var msg = {
      'action':  'ExtensionState',
      'context': 'from_internal',
      'exten':    data.phone,
    };
    ami.action(msg, function(err, res) {
      callback(err, res);
    });
  });

  dispatcher.on('ws:extensionstatelist', function(data, callback) {
    var msg = {
      'action':  'extensionstatelist'
    };
    ami.actionComplete(msg, function(err, res) {
      callback(err, res);
    });
  });

  dispatcher.on('ws:presencestate', function(data, callback) {
    // Action: PresenceState
    // ActionID: <value>
    // Provider: <value>
    var msg = {
      'action':   'PresenceState',
      'provider': 'CustomPresence',
      // 'provider':  'SIP',
    };
    ami.action(msg, function(err, res) {
      callback(err, res);
    });
  });


  /*
   Action: SIPpeerstatus
   ActionID: <value>
   [Peer:] <value>
   */
  dispatcher.on('ws:sippeerstatus', function(data, callback) {
    var msg = {
      'action':   'sippeerstatus',
    };
    ami.actionComplete(msg, function(err, res, response, complete) {
      callback(err, res);
    });
  });

  dispatcher.on('ws:queueadd', function(data, callback) {
    var queue = data.queue;
    var member = data.member;
    var device = 'SIP/'+data.phone;
    var msg = {
      action:    'QueueAdd',
      queue:     queue,
      interface: device,
      MemberName: member,
      //     Action: QueueAdd
      //     ActionID: <value>
      //   Queue: <value>
      // Interface: <value>
      // Penalty: <value>
      // Paused: <value>
      // MemberName: <value>
      // StateInterface: <value>
    };

    ami.action(msg, function(err, res) {
      callback(err, res);
    });

  });

  dispatcher.on('ws:queueremove', function(data, callback) {
    var queue = data.queue;
    var device = 'SIP/'+data.phone;
    var msg = {
      action:    'QueueRemove',
      queue:     queue,
      interface: device,
    };
    ami.action(msg, function(err, res) {
      callback(err, res);
    });

  });

  dispatcher.on('ws:queuepause', function(data, callback) {
    var queue = data.queue;
    var device = 'SIP/'+data.phone;
    var msg = {
      action:    'QueuePause',
      queue:     queue,
      interface: device,
      paused:    data.paused,
    };
    ami.action(msg, function(err, res) {
      callback(err, res);
    });
  });

  dispatcher.on('ws:queuestatus', function(data, callback) {
    var queue = data.queue;
    var msg = {
      'action': 'QueueStatus',
      // 'Queue':   queue
    };
    if (queue) { msg.queue = queue; }
    ami.actionComplete(msg,
      function (err, res, response, complete) {
        callback(err, res);
      }
    );
  });

  dispatcher.on('ws:queuesummary', function(data, callback) {
    var queue = data.queue;
    var msg = {
      'action': 'queuesummary',
      // 'Queue':   queue
    };
    if (queue) { msg.queue = queue; }

    console.log('!!! typeof callback (1): '+ typeof callback);
    ami.actionComplete(msg,
      function (err, res, response, complete) {
        console.log('!!! typeof callback (2): '+ typeof callback);
        callback(err, res);
      }
    );
  });

  dispatcher.on('ws:queuememberstatus', function(data, callback) {
    console.log('dispatcher:, ws:queuememberstatus: data: '+JSON.stringify(data));
    var queue = data.queue;
    var device = 'SIP/'+data.phone;
    var member = data.member;
    var msg = {
      'action': 'QueueStatus',
      'Queue':   queue,
      'Member':  member
    };
    ami.actionComplete(msg,
      function (err, res, response, complete) {
        callback(err, res);
      }
    );
  });

  dispatcher.on('ws:queues', function(data, callback) {
    var msg = {
      action:    'Queues',
    };
    ami.action(msg, function(err, res) {
      callback(err, res);
    });
  });

  /*
   Action: PlayDTMF
   ActionID: <value>
   Channel: <value>
   Digit: <value>
   [Duration:] <value>
   */
  dispatcher.on('ws:playdtmf', function(data, callback) {
    var phone = data.phone;
    var device = 'SIP/'+data.phone;
    var phone2 = data.phone2;
    var msg = {
      action:    'playdtmf',
      channel:   device,
      digit:     phone2,
    };
    ami.action(msg, function(err, res) {
      callback(err, res);
    });
  });

  /*
   Action: BridgeList
   ActionID: <value>
   BridgeType: <value>
   */
  dispatcher.on('ws:bridgelist', function(data, callback) {
    var msg = {
      action: 'bridgelist',
    };
    ami.actionComplete(msg, 'BridgeListComplete', function (err, res, response, complete) {
      callback(err, res);
    });
  });


  dispatcher.on('ws:raw', function(data, callback) {
    console.log('dispatcher: ws:raw: data: '+JSON.stringify(data));
    ami.action(data, function (err, res) {
        callback(err, res);
      }
    );
  });



  // ami.action({
  //   'Action': 'QueueSummary',
  //   // 'Queue': <value>
  // }, function(err, res) {
  //   console.log('>>> '+chalk.green('action: QueueSummary')+': ' +
  //     ' err:' + chalk.red(JSON.stringify(err)) + '' +
  //     ', res: ' + JSON.stringify(res));
  // });

  dispatcher.on('ws:devicestatelist', function(data, callback) {
    ami.actionComplete({
        'Action': 'DeviceStateList',
      }, 'DeviceStateListComplete',
      function (err, data, response, complete) {
        callback(err, data);
      }
    );
  });

  dispatcher.on('ws:coreshowchannels', function(data, callback) {
    ami.actionComplete({
        'action': 'coreshowchannels',
      }, 'CoreShowChannelsComplete',
      function (err, data, response, complete) {
        callback(err, data);
      }
    );
  });

  // Looks like response to Queue action is not typical and is not handled by asterisk-manager package
  // ami.action({
  //   'action': 'Queues',
  //   // 'Queue': <value>
  // }, function(err, res) {
  //   console.log('>>> '+chalk.green('action: Queues')+': ' +
  //     ' err:' + chalk.red(JSON.stringify(err)) + '' +
  //     ', res: ' + JSON.stringify(res));
  // });

};

var refreshTimers = {};
/**
 *
 * @param {function} fn
 * @param {string} timerName
 * @param {number} [timeout=5000]
 * @returns {NodeJS.Timer|number|any|*}
 */
var _delayedRefresh = function(fn, timerName, timeout) {
  // console.log('*********** _delayedRefresh');

  function cleanup() {
    // console.log('*********** cleanup');
    clearTimeout(refreshTimers[timerName]);
    refreshTimers[timerName] = null;
  }

  timeout = timeout || 5000;
  if (refreshTimers[timerName]) {
    cleanup();
  }
  refreshTimers[timerName] = setTimeout(function() {
    // console.log('*********** callback');
    cleanup();
    fn();
  }, timeout);

};

const QUEUES_REFRESH_TIMEOUT = 3000;
var delayedRefreshQueues = function() {
  _delayedRefresh(function() {
      ami.actionComplete({ 'action': 'QueueStatus' });
      ami.actionComplete({ 'action': 'QueueSummary' });
    },
    'queues',
    QUEUES_REFRESH_TIMEOUT
  );
};

var onAMIReady = function() {
  ami.actionComplete({ 'action': 'Agents' });

  ami.actionComplete({ 'action': 'devicestatelist' });
  ami.actionComplete({ 'action': 'extensionstatelist' });

  ami.actionComplete({ 'action': 'BridgeTechnologyList' });

  ami.actionComplete({ 'action': 'ConfbridgeList' });
  ami.actionComplete({ 'action': 'ConfbridgeListRooms' });

  ami.actionComplete({ 'action': 'FAXSessions' });

  ami.actionComplete({ 'action': 'MeetmeList' });
  ami.actionComplete({ 'action': 'MeetmeListRooms' });

  ami.actionComplete({ 'action': 'ParkedCalls' });

  ami.actionComplete({ 'action': 'PJSIPShowEndpoints' });
  ami.actionComplete({ 'action': 'PJSIPShowResourceLists' });

  // ami.actionComplete({ 'action': 'Queues' });
  ami.actionComplete({ 'action': 'QueueStatus' });
  ami.actionComplete({ 'action': 'QueueSummary' });

  ami.actionComplete({ 'action': 'SKINNYdevices' });

  ami.actionComplete({ 'action': 'VoicemailUsersList' });

  ami.actionComplete({ 'action': 'Status' });

  delayedRefreshQueues();
  // const QUEUE_REFRESH_INTERVAL = 5000;
  // setInterval(function() {
  //   ami.actionComplete({ 'action': 'QueueStatus' });
  //   ami.actionComplete({ 'action': 'QueueSummary' });
  // }, QUEUE_REFRESH_INTERVAL);
};
