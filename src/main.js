var bot = require('./battleinfbot')
var sockGlobal;

bot.getSessionID().then(function(id) {
  console.log(id)
  bot.openSocketConnection(id).then(function(sock) {
    console.log(sock)
    sockGlobal = sock;
    bot.loginToRandomAccount(sock).then(function() {
      console.log(sockGlobal)
      bot.mineStone(sockGlobal);
    })
  })
})
