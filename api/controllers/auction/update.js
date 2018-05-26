/***************************************************************************
 *                                                                          *
 * Update Auction record                                                    *
 *                                                                          *
 ***************************************************************************/
module.exports = async function update(req, res) {
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
     * Validate required fields                                                 *
     *                                                                          *
     ***************************************************************************/
    if (allParams.id && allParams.room && allParams.minimumAllowedBid) {
      /***************************************************************************
       *                                                                          *
       * Update Auction record by ID                                              *
       *                                                                          *
       ***************************************************************************/
      var auction = await Auction.update(
        { id: allParams.id },
        {
          title: allParams.title,
          room: allParams.room,
          minimumAllowedBid: allParams.minimumAllowedBid,
          isActive: allParams.isActive
        }
      ).meta({ fetch: true });

      /***************************************************************************
       *                                                                          *
       * Send success result to client                                            *
       *                                                                          *
       ***************************************************************************/
      return res.json(await sails.helpers.response.success(auction));
    } else {
      /***************************************************************************
       *                                                                          *
       * Invalid required fields                                                  *
       * Send error result to client                                              *
       *                                                                          *
       ***************************************************************************/
      return res.json(
        await sails.helpers.response.error({
          message: 'Invalid required parameters'
        })
      );
    }
  } catch (err) {
    /***************************************************************************
     *                                                                          *
     * Send exception error result to client                                    *
     *                                                                          *
     ***************************************************************************/
    return res.json(await sails.helpers.response.error(err));
  }
};
