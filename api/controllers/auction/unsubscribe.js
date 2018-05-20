module.exports = async function unsubscribe(req, res) {
  sails.sockets.leave(req, 'auction_model', function(err) {
    if (err) {
      return res.json({ result: false, error: err });
    }

    return res.json({ result: true });
  });
};
