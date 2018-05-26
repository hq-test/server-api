module.exports = async function logout(req, res) {
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
     * Find scoket ID from request                                              *
     *                                                                          *
     ***************************************************************************/
    var socketId = sails.sockets.getId(req);

    /***************************************************************************
     *                                                                          *
     * Find partner record by connected socket ID                               *
     *                                                                          *
     ***************************************************************************/
    var partner = await Partner.findOne({
      socket: socketId
    });

    /***************************************************************************
     *                                                                          *
     * Validate partner record                                                  *
     *                                                                          *
     ***************************************************************************/
    if (partner) {
      try {
        /***************************************************************************
         *                                                                          *
         * Update partner & remove the fields related to logged in partner          *
         *                                                                          *
         ***************************************************************************/
        await Partner.update(
          {
            socket: socketId
          },
          {
            socket: '',
            token: ''
          }
        );

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
    } else {
      /***************************************************************************
       *                                                                          *
       * Partner record not found according the input credentials                 *
       * Send error result to client                                              *
       *                                                                          *
       ***************************************************************************/
      return res.json(
        await sails.helpers.response.error({
          message: 'Invalid credentials, Partner not found'
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
