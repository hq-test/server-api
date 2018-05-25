module.exports = async function readLive(req, res) {
  try {
    if (!req.isSocket) {
      return res.json({
        result: false,
        error: { message: 'invalid socket request' }
      });
    }

    var auctions = await Auction.find({
      where: { isRunning: true, isActive: true },
      sort: 'endAt ASC'
    })
      .populate('room')
      .populate('bids', { limit: 1, sort: 'createdAt DESC' });

    console.log(auctions);
  } catch (err) {
    return res.json({ result: false, error: err });
  }
  return res.json({ result: true, data: auctions });
};
