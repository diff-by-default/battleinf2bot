var SockJS = require('sockjs-client');

// Reassign send function
SockJS.prototype.sendMessage = SockJS.prototype.send;
SockJS.prototype.doOnOpen = [];
SockJS.prototype.doOnClose = [];
SockJS.prototype.previousState = 'closed';
SockJS.prototype.state = 'closed';
SockJS.prototype.debug = false;
SockJS.prototype.debugEvents = [];
SockJS.prototype.autoReconnect = false;

SockJS.prototype.addDoOnOpen = function(fn) {
  if (this.state === 'open')
    fn();
  else
    this.doOnOpen.push(fn);
};

SockJS.prototype.addDoOnClose = function(fn) {
  if (this.state === 'closed' && this.previousState === 'open')
    fn();
  else
    this.doOnClose.push(fn);
};

SockJS.prototype.send = function(event, data) {
  if (this.debug)
    console.log('SEND (' + event + '): ' + JSON.stringify(data));

  var messageData = {
    event: event
    ,data: data
  };

  this.sendMessage(JSON.stringify(messageData));
};

SockJS.prototype.onmessage = function(e) {
  var data = JSON.parse(e.data);

  if (this.debug)
  //if (this.debugEvents.length === 0 || this.debugEvents.indexOf(data.event) >= 0)
    console.log('RECEIVE (' + data.event + '): ' + JSON.stringify(data.data));

  if (this.events[data.event]) {
    this.events[data.event](data.data);
  }
};

SockJS.prototype.events = {};
SockJS.prototype.onevent = function(name, fn) {
  this.events[name] = fn;
};

SockJS.prototype.onopen = function() {
  this.state = 'open';
  this.previousState = 'closed';
  for (var i in this.doOnOpen)
    this.doOnOpen[i]();
};

SockJS.prototype.onclose = function() {
  // Only do things if the state before being closed was open
  if (this.state === 'open') {
    console.log('CLOSED');
    this.state = 'closed';
    this.previousState = 'open';
    for (var i in this.doOnClose)
      this.doOnClose[i]();
  }

  if (this.autoReconnect) {
    // Any time the connection closes try again
    setTimeout(function() {
      console.log('TRY RECONNECT');
      sockConnect();
    }, 5000);
  }
};