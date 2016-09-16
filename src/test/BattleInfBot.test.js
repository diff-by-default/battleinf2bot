var chai = require('chai');
chai.use(require('chai-as-promised'));
chai.should();

var BattleInfBot = require('../battleinfbot.js');

describe('BattleInfBot', function() {
  it('should exist', function() {
    BattleInfBot.should.not.be.undefined;
  })
});


describe('#getSessionID()', function() {
  it('should exist', function() {
    BattleInfBot.getSessionID.should.exist;
  });

  it('should return a result', function() {
    BattleInfBot.getSessionID().should.eventually.not.be.undefined;
  })

  it('should return string of length 32', function() {
    BattleInfBot.getSessionID().should.eventually.be.a('string');
  })
});

describe('#openSocketConnection()', function() {
  this.timeout(15000)
  it('should exist', function() {
    BattleInfBot.openSocketConnection.should.exist;
  })

  it('should take a session ID and return a socket connection', function() {
    return BattleInfBot.getSessionID().then(function(id) {
      return BattleInfBot.openSocketConnection(id).should.eventually.be.fulfilled;
    })
  })
});

describe('#loginToRandomAccount()', function() {
  it('should exist', function() {
    BattleInfBot.loginToRandomAccount.should.exist;
  })

  it('should log in with a new random account', function() {
    return BattleInfBot.getSessionID().then(function(id) {
      return BattleInfBot.openSocketConnection(id).then(function(sock) {
        return BattleInfBot.loginToRandomAccount(sock).should.eventually.be.fulfilled;
      })
    })
  })
});

describe('#mineStone()', function() {
  it('should exist', function() {
    BattleInfBot.mineStone.should.exist;
  })
});

