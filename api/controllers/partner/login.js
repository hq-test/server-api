module.exports = async function login(req, res) {
  if (!req.isSocket) {
    return res.badRequest();
  }

  if (req.allParams().username && req.allParams().password) {
    var socketId = sails.sockets.getId(req);

    try {
      var partner = await Partner.findOne({
        username: req.allParams().username,
        password: req.allParams().password
      });

      console.log('------------', partner);
      if (partner) {
        try {
          await Partner.update(
            {
              id: partner.id
            },
            {
              socket: socketId
            }
          );
          res.json({
            result: true,
            data: partner
          });
        } catch (err) {
          res.json({
            result: false,
            error: err
          });
        }
      } else {
        res.json({
          result: false,
          error: 'Invalid credentials, Partner not found'
        });
      }
    } catch (err) {
      res.json({
        result: false,
        error: err
      });
    }
  } else {
    res.json({
      result: false,
      error: 'username & password are required'
    });
  }
};
