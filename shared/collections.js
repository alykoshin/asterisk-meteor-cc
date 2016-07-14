/**
 * Created by alykoshin on 05.07.16.
 */

import { Mongo } from 'meteor/mongo';

Temp              = new Mongo.Collection("temp");
Devicestatus      = new Mongo.Collection("devicestatus");
Extensionstatus   = new Mongo.Collection("extensionstatus");
Peerstatus        = new Mongo.Collection("peerstatus");
Queue             = new Mongo.Collection("queue");
Queuememberstatus = new Mongo.Collection("queuememberstatus");
Channel           = new Mongo.Collection("channel");
Bridge            = new Mongo.Collection("bridge");
Bridgechannel     = new Mongo.Collection("bridgechannel");
Channelvar        = new Mongo.Collection("channelvars");


Meteor.cleanup = function() {
  console.log('Cleanup started.');
  Temp.remove({});
  Devicestatus.remove({});
  Extensionstatus.remove({});
  Peerstatus.remove({});
  Queue.remove({});
  Queuememberstatus.remove({});
  Channel.remove({});
  Bridge.remove({});
  Bridgechannel.remove({});
  Channelvar.remove({});
  console.log('Cleanup finished.');
};

if (Meteor.isServer) {
  Meteor.startup(() => {
  });
}

