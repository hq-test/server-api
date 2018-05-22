var closeAuctionHandlers = {};

module.exports = {
  attributes: {
    title: {
      type: 'string'
    },

    room: {
      model: 'room'
    },

    minimumAllowedBid: {
      type: 'number',
      required: true
    },

    startAt: {
      type: 'number'
    },

    endAt: {
      type: 'number'
    },

    isRunning: {
      type: 'boolean',
      defaultsTo: false
    },

    isActive: {
      type: 'boolean',
      defaultsTo: true
    },

    bids: {
      collection: 'bid',
      via: 'auction'
    }
  },

  afterCreate: async function(record, proceed) {
    console.log('new auction record', record);
    var auctionPopulated = await Auction.findOne({ id: record.id }).populate(
      'room'
    );

    if (record.isRunning && record.isActive) {
      closeAuctionHandlers[record.id] = setTimeout(async () => {
        console.log('close auction in create process', record.id);
        await Auction.update(
          {
            id: record.id
          },
          {
            isRunning: false
          }
        ).meta({ fetch: true });

        var auctionPopulated = await Auction.findOne({
          id: record.id
        })
          .populate('room')
          .populate('bids', {
            limit: 2,
            sort: 'createdAt DESC'
          });

        sails.sockets.broadcast(
          'auction_model',
          'auction_model_update',
          auctionPopulated
        );
        // clearTimeout(closeAuctionHandlers[record.id]);
      }, 60000);
    }

    sails.sockets.broadcast(
      'auction_model',
      'auction_model_create',
      auctionPopulated
    );
    return proceed();
  },

  afterUpdate: async function(record, proceed) {
    var auctionPopulated = await Auction.findOne({ id: record.id })
      .populate('room')
      .populate('bids', {
        limit: 2,
        sort: 'createdAt DESC'
      });

    sails.sockets.broadcast(
      'auction_model',
      'auction_model_update',
      auctionPopulated
    );

    if (record.isRunning && record.isActive) {
      // remove old selfClose auction
      if (closeAuctionHandlers[record.id]) {
        clearTimeout(closeAuctionHandlers[record.id]);
      }

      // create an updated selfClose auction
      closeAuctionHandlers[record.id] = setTimeout(async () => {
        console.log('close auction in update process', record.id);
        await Auction.update(
          {
            id: record.id
          },
          {
            isRunning: false
          }
        ).meta({ fetch: true });

        var auctionPopulated = await Auction.findOne({
          id: record.id
        })
          .populate('room')
          .populate('bids', {
            limit: 2,
            sort: 'createdAt DESC'
          });

        console.log(
          '------- auction Populated when closing the auction ------',
          auctionPopulated
        );

        const allBids = auctionPopulated.bids;
        if (allBids.length) {
          if (allBids.length === 2) {
            // get 2 last person bid it and we need to compare them
            console.log('get 2 last person bid it and we need to compare them');

            if (
              allBids[0].bidAmount >=
              allBids[1].bidAmount + allBids[1].bidAmount * 0.05
            ) {
              // new bid is 5% greater than older, then accepted
              console.log(
                'new bid is 5% greater than older bid, then accepted'
              );
              // update bid status
              await Bid.update(
                {
                  id: allBids[0].id
                },
                {
                  status: 'Approved'
                }
              ).meta({ fetch: true });

              // find winner socket for notify
              var partner = await Partner.findOne({
                id: allBids[0].partner
              });
              console.log('find winner socket for notify', partner);

              // notify winner
              console.log(
                'notify winner',
                'room ',
                partner.socket,
                'event',
                'auction_model_close_winner',
                auctionPopulated
              );

              sails.sockets.broadcast(
                partner.socket,
                'auction_model_close_winner',
                auctionPopulated
              );
            } else {
              // new bid is not greater than 5% of older bid price, then reject all
              console.log(
                'new bid is not greater than 5% of old bid price, then reject it'
              );
              // update bid status
              await Bid.update(
                {
                  id: allBids[0].id
                },
                {
                  status: 'Rejected'
                }
              ).meta({ fetch: true });

              // find loser socket for notify
              var partner = await Partner.findOne({
                id: allBids[0].partner
              });
              console.log('find loser socket for notify', partner);

              // notify winner
              console.log(
                'notify loser',
                'room ',
                partner.socket,
                'event',
                'auction_model_close_loser',
                auctionPopulated
              );

              sails.sockets.broadcast(
                partner.socket,
                'auction_model_close_loser',
                auctionPopulated
              );
            }
          } else {
            // just 1 person bid it and we need to compare with diffault allowed bid price
            console.log(
              'just 1 person bid it and we need to compare with diffault allowed bid price'
            );
            if (
              allBids[0].bidAmount >=
              auctionPopulated.minimumAllowedBid +
                auctionPopulated.minimumAllowedBid * 0.05
            ) {
              // new bid is 5% greater than default allowed bid, then accepted
              console.log(
                'new bid is 5% greater than default allowed bid, then accepted'
              );
              // update bid status
              await Bid.update(
                {
                  id: allBids[0].id
                },
                {
                  status: 'Approved'
                }
              ).meta({ feetch: true });

              // find winner socket for notify
              var partner = await Partner.findOne({
                id: allBids[0].partner
              });
              console.log('find winner socket for notify', partner);

              // notify winner
              console.log(
                'notify winner',
                'room ',
                partner.socket,
                'event',
                'auction_model_close_winner',
                auctionPopulated
              );

              sails.sockets.broadcast(
                partner.socket,
                'auction_model_close_winner',
                auctionPopulated
              );
            } else {
              // new bid is not greater than 5% of allowed bid price, then reject it
              console.log(
                'new bid is not greater than 5% of allowed bid price, then reject it'
              );
              // update bid status
              await Bid.update(
                {
                  id: allBids[0].id
                },
                {
                  status: 'Rejected'
                }
              ).meta({ fetch: true });

              // find loser socket for notify
              var partner = await Partner.findOne({
                id: allBids[0].partner
              });
              console.log('find loser socket for notify', partner);

              // notify winner
              console.log(
                'notify loser',
                'room ',
                partner.socket,
                'event',
                'auction_model_close_loser',
                auctionPopulated
              );

              sails.sockets.broadcast(
                partner.socket,
                'auction_model_close_loser',
                auctionPopulated
              );
            }
          }
        }

        sails.sockets.broadcast(
          'auction_model',
          'auction_model_update',
          auctionPopulated
        );
      }, 60000);
    }

    return proceed();
  },

  afterDestroy: function(record, proceed) {
    console.log('destroy auction record', record);
    sails.sockets.broadcast('auction_model', 'auction_model_destroy', record);

    // remove old selfClose auction
    if (closeAuctionHandlers[record.id]) {
      clearTimeout(closeAuctionHandlers[record.id]);
    }

    return proceed();
  }
};
