module.exports = async function send(req, res) {
  if (!req.isSocket) {
    return res.badRequest();
  }

  var socketId = sails.sockets.getId(req);
  // => "BetX2G-2889Bg22xi-jy"

  sails.log('My socket ID is: ' + socketId);

  sails.sockets.broadcast(socketId, { data: 'success from server' });

  res.json({ result: 'success' });
};
