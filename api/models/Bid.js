const moment = require('moment');

module.exports = {
  attributes: {
    auction: {
      model: 'auction'
    },

    partner: {
      model: 'partner'
    },

    bidAmount: {
      type: 'number',
      required: true
    },

    status: {
      type: 'string',
      isIn: ['Pending', 'Rejected', 'Approved'],
      defaultsTo: 'Pending'
    }
  },

  afterCreate: async function(record, proceed) {
    console.log('new bid record', record);
    let populatedBid = await Bid.findOne({ id: record.id }).populate('partner');
    sails.sockets.broadcast('bid_model', 'bid_model_create', populatedBid);

    // read auction to check the end time
    // if END TIME is less than a minute add 1 Min to end time
    var auction = await Auction.findOne({
      id: record.auction
    });

    if (auction) {
      let expireDuration = moment(auction.endAt).diff(new Date(), 'seconds');
      let needUpdateAuctionEndAt = expireDuration < 60 ? true : false;

      console.log(
        ' ---------  needUpdateAuctionEndAt',
        needUpdateAuctionEndAt,
        expireDuration,
        'seconds'
      );

      if (needUpdateAuctionEndAt) {
        // update Auction endAt feild and increase it 1 min
        await Auction.update(
          {
            id: record.auction
          },
          {
            endAt: moment(auction.endAt)
              .add('1', 'm')
              .valueOf()
          }
        ).meta({ fetch: true });
      } else {
        // send all listeners of auction new bid received
        var auctionPopulated = await Auction.findOne({
          id: record.auction
        })
          .populate('room')
          .populate('bids', { limit: 1, sort: 'createdAt DESC' });

        sails.sockets.broadcast(
          'auction_model',
          'auction_model_update',
          auctionPopulated
        );
      }
    }

    return proceed();
  },

  afterUpdate: async function(record, proceed) {
    console.log('update bid record', record);
    let populatedBid = await Bid.findOne({ id: record.id }).populate('partner');

    sails.sockets.broadcast('bid_model', 'bid_model_update', populatedBid);

    // notify auction that have their bids chanages
    var auctionPopulated = await Auction.findOne({
      id: record.auction
    })
      .populate('room')
      .populate('bids', { limit: 1, sort: 'createdAt DESC' });

    if (auctionPopulated) {
      sails.sockets.broadcast(
        'auction_model',
        'auction_model_update',
        auctionPopulated
      );
    }

    // notify loser partner for this auction bid
    // find loser socket for notify
    var partner = await Partner.findOne({
      id: record.partner
    });
    console.log('find loser socket for notify', partner);

    // notify winner
    console.log(
      'notify loser',
      'room ',
      partner.socket,
      'event',
      'bid_model_loser',
      auctionPopulated
    );

    sails.sockets.broadcast(partner.socket, 'bid_model_loser', record);

    return proceed();
  }
};
