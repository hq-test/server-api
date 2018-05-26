module.exports = async function login(req, res) {
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
    if (allParams.username && allParams.password) {
      /***************************************************************************
       *                                                                          *
       * Find scoket ID from request                                              *
       *                                                                          *
       ***************************************************************************/
      var socketId = sails.sockets.getId(req);

      /***************************************************************************
       *                                                                          *
       * Find partner with credentials                                            *
       *                                                                          *
       ***************************************************************************/
      var partner = await Partner.findOne({
        username: allParams.username,
        password: allParams.password
      });

      /***************************************************************************
       *                                                                          *
       * Validate partner record                                                  *
       *                                                                          *
       ***************************************************************************/
      if (partner) {
        /***************************************************************************
         *                                                                          *
         * Update partner record with connected socket ID for communication         *
         *                                                                          *
         ***************************************************************************/
        await Partner.update(
          {
            id: partner.id
          },
          {
            socket: socketId
          }
        );

        /***************************************************************************
         *                                                                          *
         * Send success result to client                                            *
         *                                                                          *
         ***************************************************************************/
        return res.json(await sails.helpers.response.success(partner));
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
    } else {
      /***************************************************************************
       *                                                                          *
       * Invalid required fields                                                  *
       * Send error result to client                                              *
       *                                                                          *
       ***************************************************************************/
      return res.json(
        await sails.helpers.response.error({
          message: 'username & password are required'
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
