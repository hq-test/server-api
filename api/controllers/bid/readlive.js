module.exports = async function readLive(req, res) {
  try {
    if (!req.isSocket) {
      return res.json({
        result: false,
        error: { message: 'invalid socket request' }
      });
    }

    var allParams = req.allParams();

    if (!allParams.id) {
      return res.json({
        result: false,
        error: { message: 'Invalid auction ID' }
      });
    }
    var totalBids = await Bid.count({ auction: allParams.id });

    var bids = await Bid.find({
      where: { auction: allParams.id },
      sort: 'id DESC',
      limit: 3
    }).populate('partner');

    console.log(bids);
    return res.json({ result: true, data: { bids, totalBids } });
  } catch (err) {
    return res.json({ result: false, error: err });
  }
};
