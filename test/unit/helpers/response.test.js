var expect = require('chai').expect;

describe('Response Helpers Unit Tests', function() {
  describe('#Success', function() {
    it('Create an empty success response', async () => {
      var result = await sails.helpers.response.success();
      expect(result).to.be.a('object');
      expect(result.result).to.be.eql(true);
      expect(result.data).to.be.eql(null);
    });

    it('Create a success response with data', async () => {
      var result = await sails.helpers.response.success({ test: true });
      expect(result).to.be.a('object');
      expect(result.result).to.be.eql(true);
      expect(result.data).to.be.a('object');
      expect(result.data.test).to.be.eql(true);
    });
  });

  describe('#Error', function() {
    it('Create an empty error response', async () => {
      var result = await sails.helpers.response.error();

      expect(result).to.be.a('object');
      expect(result.result).to.be.eql(false);
      expect(result.error).to.be.eql(null);
    });

    it('Create an error response with data, fake error', async () => {
      var result = await sails.helpers.response.error({ message: 'something' });

      expect(result).to.be.a('object');
      expect(result.result).to.be.eql(false);
      expect(result.error).to.be.a('object');
      expect(result.error.message).to.be.eql('something');
    });

    it('Create an error response with data, real error', async () => {
      var result = await sails.helpers.response.error(new Error('something'));

      expect(result).to.be.a('object');
      expect(result.result).to.be.eql(false);
      expect(result.error.message).to.be.eql('something');
    });
  });
});
