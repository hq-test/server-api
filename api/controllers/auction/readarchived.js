module.exports = async function readArchived(req, res) {
  if (!req.isSocket) {
    return res.json({
      result: false,
      error: { message: 'invalid socket request' }
    });
  }

  try {
    var auctions = await Auction.find({
      where: {
        isRunning: false,
        isActive: true,
        startAt: { '>': 0 },
        endAt: { '>': 0 }
      },
      sort: 'endAt ASC'
    })
      .populate('room')
      .populate('bids', { limit: 1, sort: 'createdAt DESC' });

    return res.json({ result: true, data: auctions });
  } catch (err) {
    return res.json({ result: false, error: err });
  }
};
