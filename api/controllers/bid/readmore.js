module.exports = async function readMore(req, res) {
  try {
    if (!req.isSocket) {
      return res.json({
        result: false,
        error: { message: 'invalid socket request' }
      });
    }

    var allParams = req.allParams();

    if (!allParams.id || !allParams.maxId) {
      return res.json({
        result: false,
        error: { message: 'Invalid required parameters' }
      });
    }

    var bids = await Bid.find({
      where: { auction: allParams.id, id: { '<': allParams.maxId } },
      sort: 'id DESC',
      limit: 3
    }).populate('partner');

    return res.json({ result: true, data: bids });
  } catch (err) {
    return res.json({ result: false, error: err });
  }
};
