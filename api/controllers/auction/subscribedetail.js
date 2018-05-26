module.exports = async function subscribeDetail(req, res) {
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
     * Subscribe to listening bid room                                          *
     *                                                                          *
     ***************************************************************************/
    sails.sockets.join(req, 'bid_model');

    /***************************************************************************
     *                                                                          *
     * Send success result to client                                            *
     *                                                                          *
     ***************************************************************************/
    return res.json(await sails.helpers.response.success());
  } catch (err) {
    /***************************************************************************
     *                                                                          *
     * Send exception error result to client                                    *
     *                                                                          *
     ***************************************************************************/
    return res.json(await sails.helpers.response.error(err));
  }
};
