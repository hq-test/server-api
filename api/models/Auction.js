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
    console.log('result of creation is', auctionPopulated);

    sails.sockets.broadcast(
      'auction_model',
      'auction_model_create',
      auctionPopulated
    );
    return proceed();
  },

  afterUpdate: async function(record, proceed) {
    console.log('update auction record', record);

    var auctionPopulated = await Auction.findOne({ id: record.id }).populate(
      'room'
    );
    console.log('result of update is', auctionPopulated);

    sails.sockets.broadcast(
      'auction_model',
      'auction_model_update',
      auctionPopulated
    );
    return proceed();
  },

  afterDestroy: function(record, proceed) {
    console.log('destroy auction record', record);
    sails.sockets.broadcast('auction_model', 'auction_model_destroy', record);
    return proceed();
  }
};
