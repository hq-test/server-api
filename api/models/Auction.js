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

  afterCreate: function(record, proceed) {
    console.log('new auction record', record);
    sails.sockets.broadcast('auction_model', {
      action: 'create',
      data: record
    });
    return proceed();
  },

  afterUpdate: function(record, proceed) {
    console.log('update auction record', record);
    sails.sockets.broadcast('auction_model', {
      action: 'update',
      data: record
    });
    return proceed();
  },

  afterDestroy: function(record, proceed) {
    console.log('destroy auction record', record);
    sails.sockets.broadcast('auction_model', {
      action: 'delete',
      data: record
    });
    return proceed();
  }
};
