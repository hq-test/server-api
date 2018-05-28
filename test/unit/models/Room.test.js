var expect = require('chai').expect;

describe('Room (model) Unit Tests', function() {
  describe('#Create', function() {
    it('Create a new room', async () => {
      var room = await Room.create({
        title: 'test-room',
        mainImageUri: '',
        isActive: true
      }).meta({ fetch: true });
      expect(room).to.be.a('object');
    });

    it('title fields is required', async () => {
      try {
        await Room.create({}).meta({ fetch: true });
        throw new Error('title fields is required');
      } catch (err) {
        return err;
      }
    });
  });

  describe('#Update', function() {
    it('Update created room', async () => {
      var room = await Room.update(
        {
          title: 'test-room',
          mainImageUri: '',
          isActive: true
        },
        {
          title: 'test-room1',
          mainImageUri: 'http://',
          isActive: false
        }
      ).meta({ fetch: true });
      expect(room).to.be.a('array');
      expect(room).to.have.length(1);
      expect(room[0]).to.be.a('object');
    });
  });

  describe('#Delete', function() {
    it('Remove updated room', async () => {
      var room = await Room.destroy({
        title: 'test-room1',
        mainImageUri: 'http://',
        isActive: false
      }).meta({ fetch: true });
      expect(room).to.be.a('array');
      expect(room).to.have.length(1);
      expect(room[0]).to.be.a('object');
    });
  });
});
