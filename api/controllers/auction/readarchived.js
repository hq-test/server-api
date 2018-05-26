module.exports = async function readArchived(req, res) {
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
     * Find all auction that are Archived                                       *
     *                                                                          *
     ***************************************************************************/
    var auctions = await Auction.find({
      where: {
        isRunning: false,
        isActive: true,
        startAt: { '>': 0 },
        endAt: { '>': 0 }
      },
      sort: 'endAt ASC'
    })
      .populate('room')
      .populate('bids', { limit: 1, sort: 'createdAt DESC' });

    /***************************************************************************
     *                                                                          *
     * Send success result to client                                            *
     *                                                                          *
     ***************************************************************************/
    return res.json(await sails.helpers.response.success(auctions));
  } catch (err) {
    /***************************************************************************
     *                                                                          *
     * Send exception error result to client                                    *
     *                                                                          *
     ***************************************************************************/
    return res.json(await sails.helpers.response.error(err));
  }
};
