module.exports = async function subscribeDetail(req, res) {
  if (!req.isSocket) {
    return res.json({
      result: false,
      error: { message: 'invalid socket request' }
    });
  }
  sails.sockets.join(req, 'bid_model', function(err) {
    if (err) {
      return res.json({ result: false, error: err });
    }

    return res.json({ result: true });
  });
};
