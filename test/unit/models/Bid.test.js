var expect = require('chai').expect;
var startTime = new Date().getTime();
var endTime = startTime + 60000; // 1 Minute for test

describe('Bid (model) Unit Tests', function() {
  describe('#Create', function() {
    it('Create a new bid for an executed auction with Pending status', async () => {
      var partner = await Partner.create({
        username: 'test-b',
        password: 'test-b',
        title: 'test-b'
      }).meta({ fetch: true });
      expect(partner).to.be.a('object');

      var room = await Room.create({
        title: 'test-bid-room-b',
        mainImageUri: '',
        isActive: true
      }).meta({ fetch: true });
      expect(room).to.be.a('object');

      var auction = await Auction.create({
        title: 'test-auction-b',
        room: room.id,
        minimumAllowedBid: 1000,
        isRunning: true,
        startAt: startTime,
        endAt: endTime,
        isActive: true
      }).meta({ fetch: true });
      expect(auction).to.be.a('object');

      var bid = await Bid.create({
        partner: partner.id,
        auction: auction.id,
        status: 'Pending',
        bidAmount: 1100
      }).meta({ fetch: true });
      expect(bid).to.be.a('object');
      expect(bid.status).to.be.a('string');
    });

    it('bidAmount field is required', async () => {
      try {
        await Bid.create({}).meta({ fetch: true });
        throw new Error('bidAmount field is required');
      } catch (err) {
        return err;
      }
    });
  });

  describe('#Update', function() {
    it('Approve created bid', async () => {
      var bid = await Bid.update(
        {
          status: 'Pending'
        },
        {
          status: 'Approved'
        }
      ).meta({ fetch: true });
      expect(bid).to.be.a('array');
      expect(bid).to.have.length(1);
      expect(bid[0]).to.be.a('object');
      expect(bid[0].status).to.be.eql('Approved');
    });

    it('Reject created bid', async () => {
      var bid = await Bid.update(
        {
          status: 'Approved'
        },
        {
          status: 'Rejected'
        }
      ).meta({ fetch: true });
      expect(bid).to.be.a('array');
      expect(bid).to.have.length(1);
      expect(bid[0]).to.be.a('object');
      expect(bid[0].status).to.be.eql('Rejected');
    });
  });

  describe('#Delete', function() {
    it('Remove updated bid', async () => {
      var bid = await Bid.destroy({
        status: 'Rejected'
      }).meta({ fetch: true });
      expect(bid).to.be.a('array');
      expect(bid).to.have.length(1);
      expect(bid[0]).to.be.a('object');

      var auctions = await Auction.destroy({
        title: 'test-auction-b'
      }).meta({ fetch: true });
      expect(auctions).to.be.a('array');
      expect(auctions).to.have.length(1);
      expect(auctions[0]).to.be.a('object');

      var rooms = await Room.destroy({
        title: 'test-bid-room-b'
      }).meta({ fetch: true });
      expect(rooms).to.be.a('array');
      expect(rooms).to.have.length(1);
      expect(rooms[0]).to.be.a('object');

      var partner = await Partner.destroy({
        username: 'test-b',
        password: 'test-b',
        title: 'test-b'
      }).meta({ fetch: true });
      expect(partner).to.be.a('array');
      expect(partner).to.have.length(1);
      expect(partner[0]).to.be.a('object');
    });
  });
});
