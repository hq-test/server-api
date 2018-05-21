module.exports = async function readLive(req, res) {
  try {
    var auctions = await Auction.find({
      where: { isRunning: true, isActive: true },
      sort: 'endAt ASC'
    }).populate('room');
    console.log(auctions);
  } catch (err) {
    return res.json({ result: false, error: err });
  }
  return res.json({ result: true, data: auctions });
};
