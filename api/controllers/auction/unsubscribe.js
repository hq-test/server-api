module.exports = async function unsubscribe(req, res) {
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
     * unsubscribe from listening auction room                                      *
     *                                                                          *
     ***************************************************************************/
    sails.sockets.leave(req, 'auction_model');

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
