const util = require('util');
const chalk = require('chalk');
const debug = require('debug')('dispatcher');

var Dispatcher = function() {
  EventEmitter.call(this);
};

var EventEmitter = require('events').EventEmitter;
util.inherits(Dispatcher, EventEmitter);

// class Dispatcher extends EventEmitter {}

//

Dispatcher.prototype._emit = Dispatcher.prototype.emit;

Dispatcher.prototype.emit = function(event, arg1, arg2) {
  var args = Array.prototype.slice.call(arguments);
  debug(chalk.magenta('Dispatcher: emit(): ' + JSON.stringify(args)));
  debug(chalk.magenta('Dispatcher: emit(): event' + event + ', msg: '+ JSON.stringify(arg1)) + ', typeof arg2: ' + typeof arg2);
  // this._emit.apply(this, arguments);
  this._emit(event, arg1, arg2);
};

//

Dispatcher.prototype._on = Dispatcher.prototype.on;

Dispatcher.prototype.on = function(event, listener) {
  var args = Array.prototype.slice.call(arguments);
  debug(chalk.magenta('Dispatcher: on(): ' + JSON.stringify(args)));
  debug(chalk.magenta('Dispatcher: on(): event: ' + JSON.stringify(event) + ', typeof listener: '+typeof listener));
  // this._on.apply(this, arguments);
  this._on(event, listener);
};

//

Dispatcher.prototype.subscribe = function(source, filter, callback) {
  filter = Array.isArray(filter) ? filter : [filter];
  debug(chalk.magenta('Dispatcher.subscribe(): source:'+ source+ ', filter: '+JSON.stringify(filter)));
  this.on(source, function(event) {
    debug(chalk.magenta('Dispatcher.subscribe(): this.on(): source:'+ source+ ', filter: '+JSON.stringify(filter)));
    filter.forEach(function(singleFilter) {
      if (_.matches(singleFilter)(event)) {
        // this.publish(source, event, callback);
        debug(chalk.magenta('Dispatcher.subscribe(): this.on(): matches: source:'+ source+ ', filter: '+JSON.stringify(filter)));
        callback(source, event);
      }
    });
  });
};


Dispatcher.prototype.publish = function(source, event, callback) {
  debug(chalk.magenta('Dispatcher.publish(): source:'+ source+ ', event: '+JSON.stringify(event)));
  this.emit(source, event, callback);
};


//

// const

 dispatcher = new Dispatcher();

// var dispatcher = {
//   on: function() {},
//   emit: function() {},
//   publish: function() {},
//   subscribe: function() {},
// };
