/***************************************************************************
 *                                                                          *
 * Room model                                                               *
 *                                                                          *
 ***************************************************************************/
module.exports = {
  /***************************************************************************
   *                                                                          *
   * Attributes                                                               *
   *                                                                          *
   ***************************************************************************/
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

    /***************************************************************************
     *                                                                          *
     * One-to-many relation with Auction model                                  *
     *                                                                          *
     ***************************************************************************/
    auctions: {
      collection: 'auction',
      via: 'room'
    }
  }
};
