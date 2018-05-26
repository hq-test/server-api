/***************************************************************************
 *                                                                          *
 * Bid Model                                                                *
 *                                                                          *
 ***************************************************************************/

/***************************************************************************
 *                                                                          *
 * Load moment library                                                      *
 *                                                                          *
 ***************************************************************************/
const moment = require('moment');

module.exports = {
  /***************************************************************************
   *                                                                          *
   * Attributes                                                               *
   *                                                                          *
   ***************************************************************************/
  attributes: {
    auction: {
      model: 'auction'
    },

    /***************************************************************************
     *                                                                          *
     * One way relation to Partner model                                        *
     *                                                                          *
     ***************************************************************************/
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

  /***************************************************************************
   *                                                                          *
   * Model Events                                                             *
   *                                                                          *
   ***************************************************************************/

  /***************************************************************************
   *                                                                          *
   * Trigger after create bid                                                 *
   *                                                                          *
   ***************************************************************************/
  afterCreate: async function(record, proceed) {
    /***************************************************************************
     *                                                                          *
     * Find created bid with related data                                       *
     *                                                                          *
     ***************************************************************************/
    let populatedBid = await Bid.findOne({ id: record.id }).populate('partner');

    /***************************************************************************
     *                                                                          *
     * Populated created bid with related data to all listeners                 *
     *                                                                          *
     ***************************************************************************/
    sails.sockets.broadcast('bid_model', 'bid_model_create', populatedBid);

    /***************************************************************************
     *                                                                          *
     * Read auction to check the end time                                       *
     * If END TIME is less than a minute add 1 Min to end time                  *
     *                                                                          *
     ***************************************************************************/
    var auction = await Auction.findOne({
      id: record.auction
    });

    /***************************************************************************
     *  Validate auction record                                                 *
     *                                                                          *
     ***************************************************************************/
    if (auction) {
      /***************************************************************************
       *                                                                          *
       * calculate when the auction expire                                        *
       *                                                                          *
       ***************************************************************************/
      let expireDuration = moment(auction.endAt).diff(new Date(), 'seconds');

      /***************************************************************************
       *                                                                          *
       * Check it is necessary to update auction expire time                      *
       * If expire duration is less than 1 Minute is it necessary to update       *
       *                                                                          *
       ***************************************************************************/
      let needUpdateAuctionEndAt = expireDuration < 60 ? true : false;

      if (needUpdateAuctionEndAt) {
        /***************************************************************************
         *                                                                          *
         * Update Auction endAt feild and increase it X minuete                     *
         *                                                                          *
         ***************************************************************************/
        await Auction.update(
          {
            id: record.auction
          },
          {
            endAt: moment(auction.endAt)
              .add(
                sails.config.custom.defaultIncrementBidExpirationByMinutes,
                'm'
              )
              .valueOf()
          }
        ).meta({ fetch: true });
      } else {
        /***************************************************************************
         *                                                                          *
         * Send all listeners of auction new bid received                           *
         *                                                                          *
         ***************************************************************************/
        var auctionPopulated = await Auction.findOne({
          id: record.auction
        })
          .populate('room')
          .populate('bids', { limit: 1, sort: 'createdAt DESC' });

        /***************************************************************************
         *                                                                          *
         * Populate updated auction to all listeners                                *
         *                                                                          *
         ***************************************************************************/
        sails.sockets.broadcast(
          'auction_model',
          'auction_model_update',
          auctionPopulated
        );
      }
    }

    return proceed();
  },

  /***************************************************************************
   *                                                                          *
   * Trigger after update bid                                                 *
   *                                                                          *
   ***************************************************************************/
  afterUpdate: async function(record, proceed) {
    /***************************************************************************
     *                                                                          *
     * Find created bid with related data                                       *
     *                                                                          *
     ***************************************************************************/
    let populatedBid = await Bid.findOne({ id: record.id }).populate('partner');

    /***************************************************************************
     *                                                                          *
     * Populated updated bid with related data to all listeners                 *
     *                                                                          *
     ***************************************************************************/
    sails.sockets.broadcast('bid_model', 'bid_model_update', populatedBid);

    /***************************************************************************
     *                                                                          *
     * Notify auction that have their bids chanages                             *
     *                                                                          *
     ***************************************************************************/
    var auctionPopulated = await Auction.findOne({
      id: record.auction
    })
      .populate('room')
      .populate('bids', { limit: 1, sort: 'createdAt DESC' });

    /***************************************************************************
     *                                                                          *
     * Populate updated auction to all listeners                                *
     *                                                                          *
     ***************************************************************************/
    if (auctionPopulated) {
      sails.sockets.broadcast(
        'auction_model',
        'auction_model_update',
        auctionPopulated
      );
    }

    /***************************************************************************
     *                                                                          *
     * Notify loser partner for this auction bid                                *
     * Find loser socket for notify                                             *
     *                                                                          *
     ***************************************************************************/
    var partner = await Partner.findOne({
      id: record.partner
    });

    /***************************************************************************
     *                                                                          *
     * Populate loser bid to all listeners                                      *
     *                                                                          *
     ***************************************************************************/
    sails.sockets.broadcast(partner.socket, 'bid_model_loser', record);

    return proceed();
  }
};
