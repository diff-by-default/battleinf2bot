this.getSessionID = function() {
  return new Promise(function(resolve, reject) {

    var request = require('request');
    request("http://battleinf.com:4001/", { method: 'HEAD' }, function(err, res, body) {
      var cookieHeader = res.headers['set-cookie'][0];

      var cookieParts = cookieHeader.split(';');
      var cookies = {};
      for (var i in cookieParts) {
        var parts = cookieParts[i].split('=');
        cookies[parts[0].trim()] = parts[1];
      }

      if (cookies.sessionId) {
        resolve(cookies.sessionId)
      } else {
        reject('fail')
      }
    });
  });
}


this.openSocketConnection = function(id) {
  return new Promise(function(resolve, reject) {
    require('./SockJSWrapper')
    var SockJS = require('sockjs-client');

    var sock = new SockJS('http://battleinf.com:4001/sock');

    sock.onevent('sessionConnected', function(data) {
      resolve(sock);
    })

    sock.onopen = function() {
      sock.send('shared.connectSession', {sessionId: id});
    };


  });
};

this.loginToRandomAccount = function(sock) {
  return new Promise(function(resolve, reject) {

    sock.onevent('ready', function(data) {
      sock.send('setGroup', {group: "user"});
      resolve();
    })
    sock.onevent('login', function(data) {
      if (data.success == true) {
        sock.send('shared.socketLogin', null);

      } else {
        reject();
      }
    });
    sock.onevent('justPlay', function(data) {
      sock.send('account.signup', {
        username:data.username
        ,email:""
        ,password:data.password
        ,random:true
      });
    });
    sock.send('account.random', {justPlay:true});
  });
};

this.mineStone = function(sock) {
  sock.onevent('setArea', function(data) {
    console.log('mining?')
    sock.send('userSetTownAction', {action: "mineStone"});
  })
  sock.send('world.selectArea', {areaId: "22"});
}
