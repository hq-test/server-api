const moment = require('moment');

module.exports = async function create(req, res) {
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
    if (allParams.room && allParams.minimumAllowedBid) {
      /***************************************************************************
       *                                                                          *
       * Default Query for creating an auction without execution                  *
       *                                                                          *
       ***************************************************************************/
      let query = {
        title: allParams.title,
        room: allParams.room,
        minimumAllowedBid: allParams.minimumAllowedBid,
        isActive: allParams.isActive
      };

      /***************************************************************************
       *                                                                          *
       * Check input param and make sure it need to execute right now or not      *
       *                                                                          *
       ***************************************************************************/
      if (allParams.isRunning) {
        /***************************************************************************
         *                                                                          *
         * Default Query for creating an auction with execution right now           *
         * Default duration is 1 Minute                                             *
         *                                                                          *
         ***************************************************************************/
        query = {
          ...query,
          isRunning: true,
          startAt: new Date().getTime(),
          endAt: moment()
            .add(sails.config.custom.defaultBidDurationByMinutes, 'm')
            .valueOf()
        };
      }

      /***************************************************************************
       *                                                                          *
       * Create a new auction record according to prepared query                  *
       *                                                                          *
       ***************************************************************************/
      var auction = await Auction.create(query).meta({ fetch: true });

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
