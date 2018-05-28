//var expect = require('chai').expect;
describe('Partner (model)', function() {
  describe('#API call', function() {
    it('call get api of shortcodes', done => {
      sails.config.clientIo.socket.get('/partner', function serverResponded(
        body,
        JWR
      ) {
        console.log('result is !!!!', body, JWR);
        return done();
      });
    });
  });
});
