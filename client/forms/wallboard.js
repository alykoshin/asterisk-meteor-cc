"use strict";

import { Template } from 'meteor/templating';
// import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
// import { Session } from 'meteor/session';
import { Session } from 'meteor/session';

import './wallboard.html';



Template.wallboard.helpers({

  _queue() {
    return Queue.find({}, { sort: { queue: 1 } });
  },

});
