module.exports = {
  attributes: {
    title: {
      type: 'string',
      required: true
    },

    room: {
      model: 'room'
    },

    minimumAllowedBid: {
      type: 'number',
      required: true
    },

    startAt: {
      type: 'number',
      required: true
    },

    endAt: {
      type: 'number',
      required: true
    },

    lastBidAt: {
      type: 'number'
    },

    lastBidAmount: {
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
  }
};
