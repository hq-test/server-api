module.exports = async function read(req, res) {
  try {
    var auctions = await Auction.find({
      sort: 'endAt DESC'
    })
      .populate('room')
      .populate('bids', { limit: 1, sort: 'createdAt DESC' });
    console.log('all rooms reading', auctions);
  } catch (err) {
    return res.json({ result: false, error: err });
  }
  return res.json({ result: true, data: auctions });
};
