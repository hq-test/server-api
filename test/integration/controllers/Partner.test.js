var expect = require('chai').expect;
var partner;
//var room;
var auction;
var winnerBid;
var loserBid;
var allBids = [];
var maxId;

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

  describe('#Todos', function() {
    it('Create a new room', async () => {
      room = await Room.create({
        title: 'test-room1',
        mainImageUri: '',
        isActive: true
      }).meta({ fetch: true });
      expect(room).to.be.a('object');
    });

    it('create an auction for created room without execution', done => {
      sails.config.clientIo.socket.post(
        '/api/auction/create',
        {
          title: 'test-auction2',
          room: room.id,
          minimumAllowedBid: 1000,
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
          expect(response.data).to.have.length(1);
          expect(response.data[0]).to.be.a('object');
          expect(response.data[0].id).to.be.eql(auction.id);
          liveAuctionList = response.data;
          return done();
        }
      );
    });

    it('post a bid to auction under allowed price', done => {
      sails.config.clientIo.socket.post(
        '/api/bid/create',
        {
          bidAmount: 100,
          auction: auction.id,
          partner: partner.id
        },
        response => {
          expect(response).to.be.a('object');
          expect(response.result).to.be.eql(false);
          expect(response.error).to.be.a('object');
          expect(response.error.message).to.be.eql(
            'Your bid amount is not valid, it must be greater than 1000 BHT.'
          );
          return done();
        }
      );
    });

    it('post a bid to auction successfully', done => {
      sails.config.clientIo.socket.post(
        '/api/bid/create',
        {
          bidAmount: 2000,
          auction: auction.id,
          partner: partner.id
        },
        response => {
          expect(response).to.be.a('object');
          expect(response.result).to.be.eql(true);
          expect(response.data).to.be.a('object');
          expect(response.data.status).to.be.eql('Pending');
          loserBid = response.data;
          allBids.push(loserBid);
          return done();
        }
      );
    });

    it('search a bid with status pending', done => {
      sails.config.clientIo.socket.post(
        '/api/bid/search/id',
        {
          id: loserBid.id
        },
        response => {
          expect(response).to.be.a('object');
          expect(response.result).to.be.eql(true);
          expect(response.data.bid).to.be.a('object');
          expect(response.data.auction).to.be.a('object');
          expect(response.data.bid.status).to.be.eql('Pending');
          expect(response.data.auction.id).to.be.eql(auction.id);

          return done();
        }
      );
    });

    it('post a new bid to auction successfully to reject the old one', done => {
      sails.config.clientIo.socket.post(
        '/api/bid/create',
        {
          bidAmount: 3000,
          auction: auction.id,
          partner: partner.id
        },
        response => {
          expect(response).to.be.a('object');
          expect(response.result).to.be.eql(true);
          expect(response.data).to.be.a('object');
          expect(response.data.status).to.be.eql('Pending');
          winnerBid = response.data;
          allBids.push(winnerBid);

          return done();
        }
      );
    });

    it('Old bid notified as loser', done => {
      sails.config.clientIo.socket.post(
        '/api/bid/search/id',
        {
          id: loserBid.id
        },
        response => {
          expect(response).to.be.a('object');
          expect(response.result).to.be.eql(true);
          expect(response.data.bid).to.be.a('object');
          expect(response.data.auction).to.be.a('object');
          expect(response.data.bid.status).to.be.eql('Rejected');
          expect(response.data.auction.id).to.be.eql(auction.id);

          return done();
        }
      );
    });

    it('create the 3th bid', done => {
      sails.config.clientIo.socket.post(
        '/api/bid/create',
        {
          bidAmount: 4000,
          auction: auction.id,
          partner: partner.id
        },
        response => {
          expect(response).to.be.a('object');
          expect(response.result).to.be.eql(true);
          expect(response.data).to.be.a('object');
          expect(response.data.status).to.be.eql('Pending');
          winnerBid = response.data;
          allBids.push(winnerBid);

          return done();
        }
      );
    });

    it('create the 4th bid', done => {
      sails.config.clientIo.socket.post(
        '/api/bid/create',
        {
          bidAmount: 5000,
          auction: auction.id,
          partner: partner.id
        },
        response => {
          expect(response).to.be.a('object');
          expect(response.result).to.be.eql(true);
          expect(response.data).to.be.a('object');
          expect(response.data.status).to.be.eql('Pending');
          winnerBid = response.data;
          allBids.push(winnerBid);

          return done();
        }
      );
    });

    it('create the 5th bid', done => {
      sails.config.clientIo.socket.post(
        '/api/bid/create',
        {
          bidAmount: 6000,
          auction: auction.id,
          partner: partner.id
        },
        response => {
          expect(response).to.be.a('object');
          expect(response.result).to.be.eql(true);
          expect(response.data).to.be.a('object');
          expect(response.data.status).to.be.eql('Pending');
          winnerBid = response.data;
          allBids.push(winnerBid);

          return done();
        }
      );
    });

    it('create the 6th bid', done => {
      sails.config.clientIo.socket.post(
        '/api/bid/create',
        {
          bidAmount: 7000,
          auction: auction.id,
          partner: partner.id
        },
        response => {
          expect(response).to.be.a('object');
          expect(response.result).to.be.eql(true);
          expect(response.data).to.be.a('object');
          expect(response.data.status).to.be.eql('Pending');
          winnerBid = response.data;
          allBids.push(winnerBid);

          return done();
        }
      );
    });

    it('create the 7th bid', done => {
      sails.config.clientIo.socket.post(
        '/api/bid/create',
        {
          bidAmount: 8000,
          auction: auction.id,
          partner: partner.id
        },
        response => {
          expect(response).to.be.a('object');
          expect(response.result).to.be.eql(true);
          expect(response.data).to.be.a('object');
          expect(response.data.status).to.be.eql('Pending');
          winnerBid = response.data;
          allBids.push(winnerBid);
          return done();
        }
      );
    });

    it('read first page of live bids and validate', done => {
      sails.config.clientIo.socket.get(
        '/api/bid/read/live',
        {
          id: auction.id // auction ID
        },
        response => {
          expect(response).to.be.a('object');
          expect(response.result).to.be.eql(true);
          expect(response.data).to.be.a('object');
          expect(response.data.bids).to.be.a('array');
          expect(response.data.bids).to.have.length(3);
          expect(response.data.totalBids).to.be.eql(7);
          expect(response.data.bids[0].id).to.be.eql(allBids[6].id);
          expect(response.data.bids[1].id).to.be.eql(allBids[5].id);
          expect(response.data.bids[2].id).to.be.eql(allBids[4].id);
          maxId = response.data.bids[2].id;
          return done();
        }
      );
    });

    it('read second page of live bids and validate', done => {
      sails.config.clientIo.socket.get(
        '/api/bid/read/more',
        {
          id: auction.id, // auction ID,
          maxId
        },
        response => {
          expect(response).to.be.a('object');
          expect(response.result).to.be.eql(true);
          expect(response.data).to.be.a('array');
          expect(response.data).to.have.length(3);
          expect(response.data[0].id).to.be.eql(allBids[3].id);
          expect(response.data[1].id).to.be.eql(allBids[2].id);
          expect(response.data[2].id).to.be.eql(allBids[1].id);
          maxId = response.data[2].id;

          return done();
        }
      );
    });

    it('read 3rd page of live bids and validate', done => {
      sails.config.clientIo.socket.get(
        '/api/bid/read/more',
        {
          id: auction.id, // auction ID,
          maxId
        },
        response => {
          expect(response).to.be.a('object');
          expect(response.result).to.be.eql(true);
          expect(response.data).to.be.a('array');
          expect(response.data).to.have.length(1);
          expect(response.data[0].id).to.be.eql(allBids[0].id);

          maxId = response.data[0].id;

          return done();
        }
      );
    });

    it('there is no more pages and validate', done => {
      sails.config.clientIo.socket.get(
        '/api/bid/read/more',
        {
          id: auction.id, // auction ID,
          maxId
        },
        response => {
          expect(response).to.be.a('object');
          expect(response.result).to.be.eql(true);
          expect(response.data).to.be.a('array');
          expect(response.data).to.have.length(0);

          return done();
        }
      );
    });

    it('winner bid set by server then auction duration finished', done => {
      console.log(
        'please wait ..., it take around 2 minutes to finish the auction and set the winner'
      );
      setTimeout(() => {
        console.log('Auction closed, Checking for winner...');
        return done();
      }, 120000);
    });

    it('search a bid with status winner', done => {
      sails.config.clientIo.socket.post(
        '/api/bid/search/id',
        {
          id: winnerBid.id
        },
        response => {
          expect(response).to.be.a('object');
          expect(response.result).to.be.eql(true);
          expect(response.data.bid).to.be.a('object');
          expect(response.data.auction).to.be.a('object');
          expect(response.data.bid.status).to.be.eql('Approved');
          expect(response.data.auction.id).to.be.eql(auction.id);

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
