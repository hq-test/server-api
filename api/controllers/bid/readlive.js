module.exports = async function readLive(req, res) {
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
    if (!allParams.id) {
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

    /***************************************************************************
     *                                                                          *
     * Find total bids for the auction                                          *
     *                                                                          *
     ***************************************************************************/
    var totalBids = await Bid.count({ auction: allParams.id });

    /***************************************************************************
     *                                                                          *
     * Find most recent bids for the auction with limitation                    *
     *                                                                          *
     ***************************************************************************/
    var bids = await Bid.find({
      where: { auction: allParams.id },
      sort: 'id DESC',
      limit: 3
    }).populate('partner');

    /***************************************************************************
     *                                                                          *
     * Send success result to client                                            *
     *                                                                          *
     ***************************************************************************/
    return res.json(await sails.helpers.response.success({ bids, totalBids }));
  } catch (err) {
    /***************************************************************************
     *                                                                          *
     * Send exception error result to client                                    *
     *                                                                          *
     ***************************************************************************/
    return res.json(await sails.helpers.response.error(err));
  }
};
