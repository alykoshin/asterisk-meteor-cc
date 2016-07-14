'use strict';

//
// const WB_REFRESH = 3000;
//
// Template.wbQueueInfo.onCreated(function helloOnCreated() {
//   Meteor.setInterval(function() {
//     Meteor.callAction({ action: 'queuesummary' });
//     Meteor.callAction({ action: 'queuestatus' });
//   }, WB_REFRESH);
// });

// const threshold = {
//   callers: {
//     green: 0,
//     yellow:  5,
//
//   },
// };

import { Session } from 'meteor/session';

Meteor.setInterval(function() {
  // moment.locale('ru');
  moment.updateLocale('ru', {
    months : [
      "января", "февраля", "марта", "апреля", "мая", "июня", "июля",
      "августа", "сентября", "октября", "ноября", "декабря"
    ]
  });

  var now = moment();
  var s = now.format('DD MMMM YYYY HH:mm:ss');
  Session.set('datetime', s);
}, 1000);

Template.wbQueueInfo.helpers({

  _queue(name) {
    // console.log( name );
    // console.log(Queue.findOne({ queue: name }));
    return Queue.findOne({ queue: name });
  },

  loggedinClass() {
    var val; try { val = parseInt(this.loggedin); } catch(e) { val = 0; }
    if (val > 0) { return 'green';}
    else { return 'red'; }
  },

  availableClass() {
    var val; try { val = parseInt(this.available); } catch(e) { val = 0; }
    if (val > 0) { return 'green';}
    else { return 'red'; }
  },

  callersClass() {
    var val; try { val = parseInt(this.callers); } catch(e) { val = 0; }
    if (val < 1) { return 'green';}
    if (val < 10) { return 'yellow';}
    else { return 'red'; }
  },

  longestholdtimeClass() {
    var val; try { val = parseInt(this.longestholdtime); } catch(e) { val = 0; }
    if (val < 5) { return 'green'; }
    else if (val < 30) { return 'yellow'; }
    else { return 'red'; }
  },

  datetime() {
    // var now = moment();
    // moment.locale('ru');
    // return now.format('DD MMMM YYYY HH:MM:SS');
    return Session.get('datetime');
  },

});
