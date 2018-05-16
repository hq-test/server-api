module.exports = {
  attributes: {
    title: {
      type: 'string',
      required: true
    },

    mainImageUri: {
      type: 'string',
      defaultsTo: 'http://mp3aux.com/assets/images/empty.png'
    },

    isActive: {
      type: 'boolean',
      defaultsTo: true
    },

    auctions: {
      collection: 'auction',
      via: 'room'
    }
  }
};
