var expect = require('chai').expect;

describe('Partner (model) Unit Tests', function() {
  describe('#Create', function() {
    it('Create a new partner', async () => {
      var partner = await Partner.create({
        username: 'test',
        password: 'test',
        title: 'test'
      }).meta({ fetch: true });
      expect(partner).to.be.a('object');
    });

    it('username field is unique', async () => {
      try {
        await Partner.create({
          username: 'test',
          password: 'test',
          title: 'test'
        }).meta({ fetch: true });
        throw new Error('username must be unique');
      } catch (err) {
        return err;
      }
    });

    it('username, password and title fields are required', async () => {
      try {
        await Partner.create({}).meta({ fetch: true });
        throw new Error('username, password and title fields are required');
      } catch (err) {
        return err;
      }
    });
  });

  describe('#Update', function() {
    it('Update created partner', async () => {
      var partner = await Partner.update(
        {
          username: 'test',
          password: 'test',
          title: 'test'
        },
        {
          username: 'test-updated',
          password: 'test-updated',
          title: 'test-updated'
        }
      ).meta({ fetch: true });
      expect(partner).to.be.a('array');
      expect(partner).to.have.length(1);
      expect(partner[0]).to.be.a('object');
    });
  });

  describe('#Delete', function() {
    it('Remove updated partner', async () => {
      var partner = await Partner.destroy({
        username: 'test-updated',
        password: 'test-updated',
        title: 'test-updated'
      }).meta({ fetch: true });
      expect(partner).to.be.a('array');
      expect(partner).to.have.length(1);
      expect(partner[0]).to.be.a('object');
    });
  });
});
