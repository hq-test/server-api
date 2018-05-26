/***************************************************************************
 *                                                                          *
 * Auction Model                                                            *
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
    title: {
      type: 'string'
    },

    /***************************************************************************
     *                                                                          *
     * One way relation to Room model                                           *
     *                                                                          *
     ***************************************************************************/
    room: {
      model: 'room'
    },

    minimumAllowedBid: {
      type: 'number',
      required: true
    },

    /***************************************************************************
     *                                                                          *
     * When bid start                                                           *
     *                                                                          *
     ***************************************************************************/
    startAt: {
      type: 'number'
    },

    /***************************************************************************
     *                                                                          *
     * When bid expire                                                          *
     *                                                                          *
     ***************************************************************************/
    endAt: {
      type: 'number'
    },

    /***************************************************************************
     *                                                                          *
     * is bid LIVE ?                                                            *
     *                                                                          *
     ***************************************************************************/
    isRunning: {
      type: 'boolean',
      defaultsTo: false
    },

    isActive: {
      type: 'boolean',
      defaultsTo: true
    },

    /***************************************************************************
     *                                                                          *
     * One-to-many relation with Bid model                                      *
     *                                                                          *
     ***************************************************************************/
    bids: {
      collection: 'bid',
      via: 'auction'
    }
  },

  /***************************************************************************
   *                                                                          *
   * Model Events                                                             *
   *                                                                          *
   ***************************************************************************/

  /***************************************************************************
   *                                                                          *
   * Trigger after create auction                                             *
   *                                                                          *
   ***************************************************************************/
  afterCreate: async function(record, proceed) {
    /***************************************************************************
     *                                                                          *
     * Find created auction with related data                                   *
     *                                                                          *
     ***************************************************************************/
    var auctionPopulated = await Auction.findOne({ id: record.id }).populate(
      'room'
    );

    /***************************************************************************
     *                                                                          *
     * Check auction is Live and Active                                         *
     *                                                                          *
     ***************************************************************************/
    if (record.isRunning && record.isActive) {
      /***************************************************************************
       *                                                                          *
       * Create an automated self closing function for the auction                *
       *                                                                          *
       ***************************************************************************/
      sails.config.closeAuctionHandlers[record.id] = setTimeout(
        async () => {
          /***************************************************************************
           *                                                                          *
           * Update auction and close it                                              *
           *                                                                          *
           ***************************************************************************/
          await Auction.update(
            {
              id: record.id
            },
            {
              isRunning: false
            }
          ).meta({ fetch: true });

          /***************************************************************************
           *                                                                          *
           * Find auction and related data                                            *
           *                                                                          *
           ***************************************************************************/
          var auctionPopulated = await Auction.findOne({
            id: record.id
          })
            .populate('room')
            .populate('bids', {
              limit: 2,
              sort: 'createdAt DESC'
            });

          /***************************************************************************
           *                                                                          *
           * Populated auction details to all auction listeners                       *
           *                                                                          *
           ***************************************************************************/
          sails.sockets.broadcast(
            'auction_model',
            'auction_model_update',
            auctionPopulated
          );
        },
        /***************************************************************************
         *                                                                          *
         * Auction default duration by milliseconds                                 *
         *                                                                          *
         ***************************************************************************/
        sails.config.custom.defaultBidDurationByMiliseconds
      );
    }

    /***************************************************************************
     *                                                                          *
     * Populated auction details to all auction listeners                       *
     *                                                                          *
     ***************************************************************************/
    sails.sockets.broadcast(
      'auction_model',
      'auction_model_create',
      auctionPopulated
    );
    return proceed();
  },

  /***************************************************************************
   *                                                                          *
   * Trigger after update auction                                             *
   *                                                                          *
   ***************************************************************************/
  afterUpdate: async function(record, proceed) {
    /***************************************************************************
     *                                                                          *
     * Find updated auction with last 2 recent bids                             *
     *                                                                          *
     ***************************************************************************/
    var auctionPopulated = await Auction.findOne({ id: record.id })
      .populate('room')
      .populate('bids', {
        limit: 2,
        sort: 'createdAt DESC'
      });

    /***************************************************************************
     *                                                                          *
     * Populate updated auction to all auction listeners                        *
     *                                                                          *
     ***************************************************************************/
    sails.sockets.broadcast(
      'auction_model',
      'auction_model_update',
      auctionPopulated
    );

    /***************************************************************************
     *                                                                          *
     * Check auction is Live and Active                                         *
     *                                                                          *
     ***************************************************************************/
    if (record.isRunning && record.isActive) {
      /***************************************************************************
       *                                                                          *
       * Check & Remove old self closing function of auction                              *
       *                                                                          *
       ***************************************************************************/
      if (sails.config.closeAuctionHandlers[record.id]) {
        clearTimeout(sails.config.closeAuctionHandlers[record.id]);
      }

      /***************************************************************************
       *                                                                          *
       * calculate when the auction expire                                        *
       *                                                                          *
       ***************************************************************************/
      var expireDuration = moment(record.endAt).diff(
        new Date(),
        'milliseconds'
      );

      /***************************************************************************
       *                                                                          *
       * Create an automated self closing function for the auction                *
       *                                                                          *
       ***************************************************************************/
      sails.config.closeAuctionHandlers[record.id] = setTimeout(async () => {
        /***************************************************************************
         *                                                                          *
         * Update auction and close it                                              *
         *                                                                          *
         ***************************************************************************/
        await Auction.update(
          {
            id: record.id
          },
          {
            isRunning: false
          }
        ).meta({ fetch: true });

        /***************************************************************************
         *                                                                          *
         * Find updated auction with last 2 recent bids                             *
         *                                                                          *
         ***************************************************************************/
        var auctionPopulated = await Auction.findOne({
          id: record.id
        })
          .populate('room')
          .populate('bids', {
            limit: 2,
            sort: 'createdAt DESC'
          });

        /***************************************************************************
         *                                                                          *
         * Check it is have any bid for this auction                                *
         *                                                                          *
         ***************************************************************************/
        const allBids = auctionPopulated.bids;
        if (allBids.length) {
          /***************************************************************************
           *                                                                          *
           * Yes, This auction have some bids                                         *
           *                                                                          *
           ***************************************************************************/

          /***************************************************************************
           *                                                                          *
           * Auction have at least 2 bid ?                                            *
           *                                                                          *
           ***************************************************************************/
          if (allBids.length === 2) {
            /***************************************************************************
             *                                                                          *
             * make sure the last bid is at least more than 5% of old bid to win        *
             *                                                                          *
             ***************************************************************************/
            if (
              allBids[0].bidAmount >=
              allBids[1].bidAmount + allBids[1].bidAmount * 0.05
            ) {
              /***************************************************************************
               *                                                                          *
               * Last bid is 5% greater than the old bid and it is winner                 *
               *                                                                          *
               ***************************************************************************/

              /***************************************************************************
               *                                                                          *
               * Update bid that win the auction                                          *
               *                                                                          *
               ***************************************************************************/
              await Bid.update(
                {
                  id: allBids[0].id
                },
                {
                  status: 'Approved'
                }
              ).meta({ fetch: true });

              /***************************************************************************
               *                                                                          *
               * Find winner partner Socket ID to notify                                  *
               *                                                                          *
               ***************************************************************************/
              var partner = await Partner.findOne({
                id: allBids[0].partner
              });

              /***************************************************************************
               *                                                                          *
               * Populate the winner of auction to all auction listeners                  *
               *                                                                          *
               ***************************************************************************/
              sails.sockets.broadcast(
                partner.socket,
                'auction_model_close_winner',
                auctionPopulated
              );
            } else {
              /***************************************************************************
               *                                                                          *
               * New bid is not greater than 5% of older bid price, then reject all       *
               *                                                                          *
               ***************************************************************************/

              /***************************************************************************
               *                                                                          *
               * Update bid that lose the auction                                          *
               *                                                                          *
               ***************************************************************************/
              await Bid.update(
                {
                  id: allBids[0].id
                },
                {
                  status: 'Rejected'
                }
              ).meta({ fetch: true });

              /***************************************************************************
               *                                                                          *
               * Find loser partner Socket ID to notify                                   *
               *                                                                          *
               ***************************************************************************/
              var partner = await Partner.findOne({
                id: allBids[0].partner
              });

              /***************************************************************************
               *                                                                          *
               * Populate the loser of auction to all auction listeners                   *
               *                                                                          *
               ***************************************************************************/
              sails.sockets.broadcast(
                partner.socket,
                'auction_model_close_loser',
                auctionPopulated
              );
            }
          } else {
            /***************************************************************************
             *                                                                          *
             * Just 1 partner bid it and we need to compare with                        *
             * diffault allowed bid price                                               *
             *                                                                          *
             ***************************************************************************/
            if (
              allBids[0].bidAmount >=
              auctionPopulated.minimumAllowedBid +
                auctionPopulated.minimumAllowedBid * 0.05
            ) {
              /***************************************************************************
               *                                                                          *
               * New bid is 5% greater than default allowed bid, then accepted            *
               *                                                                          *
               ***************************************************************************/

              /***************************************************************************
               *                                                                          *
               * Update bid that win the auction                                          *
               *                                                                          *
               ***************************************************************************/
              await Bid.update(
                {
                  id: allBids[0].id
                },
                {
                  status: 'Approved'
                }
              ).meta({ feetch: true });

              /***************************************************************************
               *                                                                          *
               * Find winner partner Socket ID to notify                                  *
               *                                                                          *
               ***************************************************************************/
              var partner = await Partner.findOne({
                id: allBids[0].partner
              });

              /***************************************************************************
               *                                                                          *
               * Populate the winner of auction to all auction listeners                  *
               *                                                                          *
               ***************************************************************************/
              sails.sockets.broadcast(
                partner.socket,
                'auction_model_close_winner',
                auctionPopulated
              );
            } else {
              /***************************************************************************
               *                                                                          *
               * New bid is not greater than 5% of allowed bid price, then reject it      *
               *                                                                          *
               ***************************************************************************/

              /***************************************************************************
               *                                                                          *
               * Update bid that lose the auction                                          *
               *                                                                          *
               ***************************************************************************/
              await Bid.update(
                {
                  id: allBids[0].id
                },
                {
                  status: 'Rejected'
                }
              ).meta({ fetch: true });

              /***************************************************************************
               *                                                                          *
               * Find loser partner Socket ID to notify                                   *
               *                                                                          *
               ***************************************************************************/
              var partner = await Partner.findOne({
                id: allBids[0].partner
              });

              /***************************************************************************
               *                                                                          *
               * Populate the loser of auction to all auction listeners                   *
               *                                                                          *
               ***************************************************************************/
              sails.sockets.broadcast(
                partner.socket,
                'auction_model_close_loser',
                auctionPopulated
              );
            }
          }
        }

        /***************************************************************************
         *                                                                          *
         * Populate updated auction to all auction listeners                        *
         *                                                                          *
         ***************************************************************************/
        sails.sockets.broadcast(
          'auction_model',
          'auction_model_update',
          auctionPopulated
        );
      }, expireDuration);
    }

    return proceed();
  },

  /***************************************************************************
   *                                                                          *
   * Trigger after remove auction                                             *
   *                                                                          *
   ***************************************************************************/
  afterDestroy: function(record, proceed) {
    /***************************************************************************
     *                                                                          *
     * Populate removed auction to all auction listeners                        *
     *                                                                          *
     ***************************************************************************/
    sails.sockets.broadcast('auction_model', 'auction_model_destroy', record);

    /***************************************************************************
     *                                                                          *
     * If there is any self closing auction function, remove it                 *
     *                                                                          *
     ***************************************************************************/
    if (sails.config.closeAuctionHandlers[record.id]) {
      clearTimeout(sails.config.closeAuctionHandlers[record.id]);
    }

    return proceed();
  }
};
