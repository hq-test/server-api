module.exports = async function searchById(req, res) {
  try {
    /***************************************************************************
     *                                                                          *
     * Only socket request are valid                                            *
     *                                                                          *
     ***************************************************************************/
    if (!req.isSocket) {
      return res.json(
        await sails.helpers.response.error({
          message: 'Invalid socket request'
        })
      );
    }

    /***************************************************************************
     *                                                                          *
     * Extract input params and store in a local variable for use               *
     *                                                                          *
     ***************************************************************************/
    var allParams = req.allParams();

    /***************************************************************************
     *                                                                          *
     * Find scoket ID from request                                              *
     *                                                                          *
     ***************************************************************************/
    var socketId = sails.sockets.getId(req);

    /***************************************************************************
     *                                                                          *
     * Find partner record by Socket ID                                         *
     *                                                                          *
     ***************************************************************************/
    var partner = await Partner.findOne({ socket: socketId });

    /***************************************************************************
     *                                                                          *
     * Validate partner record                                                  *
     *                                                                          *
     ***************************************************************************/
    if (partner) {
      /***************************************************************************
       *                                                                          *
       * Find bid record by search bid ID and submiter partner                    *
       * It allow to just visit the status of logged in partner                   *
       *                                                                          *
       ***************************************************************************/
      var bid = await Bid.findOne({
        id: allParams.id,
        partner: partner.id
      });

      /***************************************************************************
       *                                                                          *
       * Validate bid record                                                      *
       *                                                                          *
       ***************************************************************************/
      if (bid) {
        /***************************************************************************
         *                                                                          *
         * Find auction of the current bid                                          *
         *                                                                          *
         ***************************************************************************/
        var auction = await Auction.findOne({
          id: bid.auction
        })
          .populate('room')
          .populate('bids', { limit: 1, sort: 'createdAt DESC' });

        /***************************************************************************
         *                                                                          *
         * Send success result to client                                            *
         *                                                                          *
         ***************************************************************************/
        res.json(await sails.helpers.response.success({ bid, auction }));
      } else {
        /***************************************************************************
         *                                                                          *
         * Bid record not found                                                     *
         * Send error result to client                                              *
         *                                                                          *
         ***************************************************************************/
        return res.json(
          await sails.helpers.response.error({
            message: 'Not found'
          })
        );
      }
    } else {
      /***************************************************************************
       *                                                                          *
       * Invalid partner according to provided input fields                       *
       * Send error result to client                                              *
       *                                                                          *
       ***************************************************************************/
      return res.json(
        await sails.helpers.response.error({
          message: 'Invalid partner'
        })
      );
    }
  } catch (err) {
    /***************************************************************************
     *                                                                          *
     * Send exception error result to client                                    *
     *                                                                          *
     ***************************************************************************/
    return es.json(await sails.helpers.response.error(err));
  }
};
