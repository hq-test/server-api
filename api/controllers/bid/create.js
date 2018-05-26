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
    if (allParams.auction && allParams.partner && allParams.bidAmount) {
      /***************************************************************************
       *                                                                          *
       * find auction that bid is for that and retrive the last bid               *
       *                                                                          *
       ***************************************************************************/
      var auction = await Auction.findOne({
        id: allParams.auction,
        isActive: true,
        isRunning: true
      }).populate('bids', {
        where: { status: 'Pending' },
        limit: 1,
        sort: 'createdAt ASC'
      });

      /***************************************************************************
       *                                                                          *
       * validate auction of bid                                                  *
       *                                                                          *
       ***************************************************************************/
      if (auction) {
        /***************************************************************************
         *                                                                          *
         * It is an active and live auction and allow to get bid on it              *
         *                                                                          *
         ***************************************************************************/

        /***************************************************************************
         *                                                                          *
         * Set default varibale for using in the next logic                         *
         *                                                                          *
         ***************************************************************************/
        var allowCreateBid = false;
        var minBid = auction.minimumAllowedBid;

        /***************************************************************************
         *                                                                          *
         * check the auction have any bid or it is an empty auction                 *
         *                                                                          *
         ***************************************************************************/
        if (auction.bids.length) {
          /***************************************************************************
           *                                                                          *
           * validate new bid price                                                   *
           *                                                                          *
           ***************************************************************************/
          if (allParams.bidAmount > auction.bids[0].bidAmount) {
            /***************************************************************************
             *                                                                          *
             * new bid is valid and allow to create it                                  *
             *                                                                          *
             ***************************************************************************/
            allowCreateBid = true;
          } else {
            /***************************************************************************
             *                                                                          *
             * Set minimum alloed bid price to last bid price                           *
             *                                                                          *
             ***************************************************************************/
            minBid = auction.bids[0].bidAmount;
          }
        } else {
          /***************************************************************************
           *                                                                          *
           * validate new bid price                                                   *
           *                                                                          *
           ***************************************************************************/
          if (allParams.bidAmount > auction.minimumAllowedBid) {
            /***************************************************************************
             *                                                                          *
             * new bid is valid and allow to create it                                  *
             *                                                                          *
             ***************************************************************************/
            allowCreateBid = true;
          }
        }

        /***************************************************************************
         *                                                                          *
         * Check new bid is valid to create it                                      *
         *                                                                          *
         ***************************************************************************/
        if (allowCreateBid) {
          /***************************************************************************
           *                                                                          *
           * create new bid for the auction and make sure it is a unique record       *
           *                                                                          *
           ***************************************************************************/
          var bid = await Bid.findOrCreate(
            {
              auction: allParams.auction,
              partner: allParams.partner,
              bidAmount: allParams.bidAmount
            },
            {
              auction: allParams.auction,
              partner: allParams.partner,
              bidAmount: allParams.bidAmount
            }
          );

          /***************************************************************************
           *                                                                          *
           * check it is necessary to update last bid and expire it ?                 *
           *                                                                          *
           ***************************************************************************/
          if (auction.bids.length) {
            /***************************************************************************
             *                                                                          *
             * Update last bid and notify loser                                         *
             *                                                                          *
             ***************************************************************************/
            await Bid.update(
              { id: auction.bids[0].id },
              {
                status: 'Rejected'
              }
            ).meta({ fetch: true });
          }

          /***************************************************************************
           *                                                                          *
           * Send success result to client                                            *
           *                                                                          *
           ***************************************************************************/
          return res.json(await sails.helpers.response.success(bid));
        } else {
          /***************************************************************************
           *                                                                          *
           * Bid is lower than allowed price                                          *
           * Send error result to client                                              *
           *                                                                          *
           ***************************************************************************/
          return res.json(
            await sails.helpers.response.error({
              message: `Your bid amount is not valid, it must be greater than ${minBid} BHT.`
            })
          );
        }
      } else {
        /***************************************************************************
         *                                                                          *
         * Auction is not allowed to receive bid                                    *
         * Send error result to client                                              *
         *                                                                          *
         ***************************************************************************/
        return res.json(
          await sails.helpers.response.error({
            message: 'Sorry, Auction is not allowed to receive bid'
          })
        );
      }
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
    res.json(await sails.helpers.response.error(err));
  }
};
