var expect = require('chai').expect;
var partner;
//var room;
//var auction;
//var bid;

describe('Partner (model) Integration Tests', function() {
  describe('#Login', function() {
    it('create a new partner for login', done => {
      sails.config.clientIo.socket.post(
        '/partner',
        {
          username: 'test',
          password: 'test',
          title: 'test'
        },
        response => {
          expect(response).to.be.a('object');
          partner = response;
          return done();
        }
      );
    });

    it('Login as a partner', done => {
      sails.config.clientIo.socket.post(
        '/api/partner/login',
        {
          username: 'test',
          password: 'test'
        },
        response => {
          expect(response).to.be.a('object');
          expect(response.result).to.be.eql(true);
          expect(response.data).to.be.a('object');
          expect(response.data.id).to.be.eql(partner.id);
          return done();
        }
      );
    });
  });

  describe('#get list of live auction', function() {
    it('Create a new room', async () => {
      room = await Room.create({
        title: 'test-room1',
        mainImageUri: '',
        isActive: true
      }).meta({ fetch: true });
      console.log('rrrrrrom', room);
      expect(room).to.be.a('object');
    });

    it('create an auction for created room and execute it', done => {
      sails.config.clientIo.socket.post(
        '/api/auction/create',
        {
          title: 'test-auction1',
          room: room.id,
          minimumAllowedBid: 1000,
          isRunning: true,
          isActive: true
        },
        response => {
          expect(response).to.be.a('object');
          expect(response.result).to.be.eql(true);
          expect(response.data).to.be.a('object');
          auction = response.data;
          return done();
        }
      );
    });

    it('read live list of auction', done => {
      sails.config.clientIo.socket.get(
        '/api/auction/read/live',
        {},
        response => {
          expect(response).to.be.a('object');
          expect(response.result).to.be.eql(true);
          expect(response.data).to.be.a('array');
          expect(response.data[0]).to.be.a('object');
          expect(response.data[0].id).to.be.a('number');
          console.log(auction);
          liveAuctionList = response.data;
          return done();
        }
      );
    });
  });

  describe('#Logout', function() {
    it('Logout a logged in partner', done => {
      sails.config.clientIo.socket.post('/api/partner/logout', {}, response => {
        expect(response).to.be.a('object');
        expect(response.result).to.be.eql(true);
        expect(response.data).to.be.eql(null);
        return done();
      });
    });
  });
});
