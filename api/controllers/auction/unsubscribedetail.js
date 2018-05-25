module.exports = async function unsubscribeDetail(req, res) {
  if (!req.isSocket) {
    return res.json({
      result: false,
      error: { message: 'invalid socket request' }
    });
  }
  sails.sockets.leave(req, 'bid_model', function(err) {
    if (err) {
      return res.json({ result: false, error: err });
    }

    return res.json({ result: true });
  });
};
