const moment = require('moment');

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
    if (allParams.id) {
      /***************************************************************************
       *                                                                          *
       * Update auction record By ID                                              *
       * If auction is not Executed yet, Execute it with Duration 1 Minute        *
       *                                                                          *
       ***************************************************************************/
      var auction = await Auction.update(
        { id: allParams.id, isRunning: false },
        {
          startAt: new Date().getTime(),
          endAt: moment()
            .add(sails.config.custom.defaultBidDurationByMinutes, 'm')
            .valueOf(),
          isRunning: true
        }
      ).meta({ fetch: true });

      /***************************************************************************
       *                                                                          *
       * Send success result to client                                            *
       *                                                                          *
       ***************************************************************************/
      return res.json(
        await sails.helpers.response.success(auction.length && auction[0])
      );
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
