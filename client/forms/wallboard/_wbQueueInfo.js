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
import { _ } from 'meteor/underscore';

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
  Session.set('now', s);
}, 1000);


Meteor.helpers = Meteor.helpers || {};
Meteor.helpers.humanizeDuration = function(input, units ) {
  // units is a string with possible values of y, M, w, d, h, m, s, ms
  var duration = moment().startOf('day').add(input, units);
  var format = "";
  if (duration.hour()   > 0) { format += "H ч ";   }
  if (duration.minute() > 0) { format += "m мин "; }
  format += "s с";

  return duration.format(format);
}


const FIELD_DEFINITIONS = {
  queue: {
    loggedin:  {
      title: 'Агентов всего',
      colors: [
        { rule: 'value>0', class: 'success' },
        { class: 'danger' },
      ]
    },
    available: {
      title: 'Агентов свободно',
      colors: [
        { rule: 'value>0', class: 'success' },
        { class: 'danger' },
      ]
    },
    callers:   {
      title: 'Вызовов в очереди',
      colors: [
        { rule: 'value<1',  class: 'success'  },
        { rule: 'value<10', class: 'warning' },
        { class: 'danger' },
      ]
    },
    holdtime:   {
      title: 'Ср.ожидание в очереди',
      value: 'Meteor.helpers.humanizeDuration(object.holdtime)',
    },
    talktime:   {
      title: 'Ср.длит.разговора',
      value: 'Meteor.helpers.humanizeDuration(object.talktime)',
    },
    longestholdtime: {
      title: 'Макс. ожидание сейчас',
      value: 'Meteor.helpers.humanizeDuration(object.longestholdtime)',
      colors: [
        { rule: 'object.longestholdtime<5',  class: 'success'  },
        { rule: 'object.longestholdtime<30', class: 'warning' },
        { class: 'danger' },
      ]
    },
    completed:   {
      title: 'Завершено',
    },
    abandoned:   {
      title: 'Отменено',
    },
    sl:   {
      title: 'Уровень сервиса',
      value: 'object.servicelevelperf+"% / "+object.servicelevel+"с"',
      colors: [
        { rule: 'object.servicelevelperf>80', class: 'success'  },
        { rule: 'object.servicelevelperf>50', class: 'warning' },
        { class: 'danger' },
      ]
    },
  },
  system: {
    now: {
      title: '',
      value: 'Session.get(\'now\')'
    }
  }
};


Meteor.helpers.getClass = function(collectionName, fieldName, object) {
  // console.log('getClass(): object:', object, 'collectionName: \''+collectionName+', fieldName: \''+fieldName+'\'');

  // var value;
  // try {
  //   value = parseInt(object[fieldName]);
  // } catch(e) {
  //   value = 0;
  // }
  var value = Meteor.helpers.getValue(collectionName, fieldName, object); // variable value may be referred in eval() below

  var defs = FIELD_DEFINITIONS[collectionName] &&
    FIELD_DEFINITIONS[collectionName][fieldName] &&
    FIELD_DEFINITIONS[collectionName][fieldName].colors;
  defs = defs || [];

  var dflt = '';
  for (var len=defs.length, i=0; i<len; i++) {
    var def = defs[i];
    if (def.rule) {
      console.log('getClass(): value: '+value+', rule: '+def.rule+': '+eval(def.rule));
      if (eval(def.rule)) {
        return def.class;
      }
    } else { // if rule is not set, this defines default class
      dflt = def.class;
    }
  }
  return dflt;
}

Meteor.helpers.getTitle = function(collectionName, fieldName, object) {
  var title = FIELD_DEFINITIONS[collectionName] &&
    FIELD_DEFINITIONS[collectionName][fieldName] &&
    FIELD_DEFINITIONS[collectionName][fieldName].title;
  title = typeof title === undefined ? fieldName : title;
  // console.log('getTitle(): fieldName: \''+fieldName+'\', title: \''+title+'\'');
  return title;
}

Meteor.helpers.getValue = function(collectionName, fieldName, object) {
  var value = FIELD_DEFINITIONS[collectionName] &&
    FIELD_DEFINITIONS[collectionName][fieldName] &&
    FIELD_DEFINITIONS[collectionName][fieldName].value;
  if (value) {
    value = eval(value);
  } else {
    value = object[fieldName] || undefined;
  }
  // console.log('getValue(): fieldName: \''+fieldName+'\', value: \''+value+'\'');
  return value;
}



Template.wb_block.helpers({
  getClass: Meteor.helpers.getClass,
  getTitle: Meteor.helpers.getTitle,
  getValue: Meteor.helpers.getValue,
});


Template.wbQueueInfo.helpers({

  _queue(name) {
    return Queue.findOne({ queue: name });
  },

  getClass: Meteor.helpers.getClass,
  getTitle: Meteor.helpers.getTitle,
  getValue: Meteor.helpers.getValue,
});
