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
     * Read partner ID from input params                                        *
     *                                                                          *
     ***************************************************************************/
    var partnerId = req.param('userId');

    /***************************************************************************
     *                                                                          *
     * Find partner record by partner ID                                        *
     *                                                                          *
     ***************************************************************************/
    var partner = await Partner.findOne({ id: partnerId });

    /***************************************************************************
     *                                                                          *
     * Check partner result and if it is valid feed as success result           *
     * And if not found feed invalid partner as error                           *
     *                                                                          *
     ***************************************************************************/
    if (!partner) {
      /***************************************************************************
       *                                                                          *
       * Invalid required fields, partner record not found                                                  *
       * Send error result to client                                              *
       *                                                                          *
       ***************************************************************************/
      return res.json(
        await sails.helpers.response.error({
          message: 'Invalid partner'
        })
      );
    } else {
      /***************************************************************************
       *                                                                          *
       * Send success result to client                                            *
       *                                                                          *
       ***************************************************************************/
      return res.json(await sails.helpers.response.success(partner));
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
