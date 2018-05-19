module.exports = async function logout(req, res) {
  if (!req.isSocket) {
    return res.badRequest();
  }

  var socketId = sails.sockets.getId(req);

  try {
    var partner = await Partner.findOne({
      socket: socketId
    });

    if (partner) {
      try {
        await Partner.update(
          {
            socket: socketId
          },
          {
            socket: '',
            token: ''
          }
        );
        res.json({
          result: true
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
};
