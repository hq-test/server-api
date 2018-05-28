var expect = require('chai').expect;
var startTime = new Date().getTime();
var endTime = startTime + 60000; // 1 Minute for test

describe('Auction (model) Unit Tests', function() {
  describe('#Create', function() {
    it('Create a new auction without execute', async () => {
      var room = await Room.create({
        title: 'test-auction-room',
        mainImageUri: '',
        isActive: true
      }).meta({ fetch: true });
      expect(room).to.be.a('object');

      var auction = await Auction.create({
        title: 'test-auction',
        room: room.id,
        minimumAllowedBid: 1000,
        isActive: true
      }).meta({ fetch: true });
      expect(auction).to.be.a('object');
    });

    it('Create a new auction with execution', async () => {
      var room2 = await Room.create({
        title: 'test-auction-room2',
        mainImageUri: '',
        isActive: true
      }).meta({ fetch: true });
      expect(room2).to.be.a('object');

      var auction = await Auction.create({
        title: 'test-auction2',
        room: room2.id,
        minimumAllowedBid: 1000,
        isRunning: true,
        startAt: startTime,
        endAt: endTime,
        isActive: true
      }).meta({ fetch: true });
      expect(auction).to.be.a('object');
    });

    it('minimumAllowedBid and room fields are required', async () => {
      try {
        await Auction.create({}).meta({ fetch: true });
        throw new Error('minimumAllowedBid and room fields are required');
      } catch (err) {
        return err;
      }
    });
  });

  describe('#Execute', function() {
    it('Check auction with execution status and start & duration value', async () => {
      var auction = await Auction.findOne({
        title: 'test-auction2',
        room: 2,
        minimumAllowedBid: 1000,
        isRunning: true,
        startAt: startTime,
        endAt: endTime,
        isActive: true
      });
      expect(auction).to.be.a('object');
    });
  });

  describe('#Update', function() {
    it('Update created auction', async () => {
      var auction = await Auction.update(
        {
          title: 'test-auction',
          room: 1,
          minimumAllowedBid: 1000,
          isRunning: false,
          isActive: true
        },
        {
          title: 'test-auction-updated',
          room: 1,
          minimumAllowedBid: 2000,
          isActive: false
        }
      ).meta({ fetch: true });
      expect(auction).to.be.a('array');
      expect(auction).to.have.length(1);
      expect(auction[0]).to.be.a('object');
    });
  });

  describe('#Delete', function() {
    it('Remove updated auction', async () => {
      var auction = await Auction.destroy({
        title: 'test-auction-updated',
        room: 1,
        minimumAllowedBid: 2000,
        isRunning: false,
        isActive: false
      }).meta({ fetch: true });
      expect(auction).to.be.a('array');
      expect(auction).to.have.length(1);
      expect(auction[0]).to.be.a('object');

      var rooms = await Room.destroy({}).meta({ fetch: true });
      expect(rooms).to.be.a('array');
      expect(rooms).to.have.length(2);
      expect(rooms[0]).to.be.a('object');
      expect(rooms[1]).to.be.a('object');
    });
  });
});
