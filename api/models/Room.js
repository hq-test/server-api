module.exports = {
  attributes: {
    title: {
      type: string,
      required: true,
      defaultsTo: 'unknown room'
    },

    mainImageUri: {
      type: string,
      required: true,
      defaultsTo: 'http://mp3aux.com/assets/images/empty.png'
    },

    isActive: {
      type: boolean,
      required: true,
      defaultsTo: 'true'
    },

    auctions: {
      collection: 'auction',
      via: 'room'
    }
  }
};
