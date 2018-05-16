module.exports = {
  attributes: {
    title: {
      type: string,
      required: true,
      defaultsTo: 'unknown auction'
    },

    room: {
      model: 'room'
    },

    minimumAllowedBid: {
      type: integer,
      required: true,
      defaultsTo: 0
    },

    startAt: {
      type: datetime,
      required: true
    },

    endAt: {
      type: datetime,
      required: true
    },

    lastBidAt: {
      type: datetime
    },

    lastBidAmount: {
      type: integer
    },

    isRunning: {
      type: boolean,
      required: true,
      defaultsTo: false
    },

    isActive: {
      type: boolean,
      required: true,
      defaultsTo: 'true'
    },

    bids: {
      collection: 'bid',
      via: 'auction'
    }
  }
};
