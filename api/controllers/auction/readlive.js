module.exports = async function readLive(req, res) {
  try {
    var auctions = await Auction.find({ isRunning: true, isActive: true });
    console.log(auctions);
  } catch (err) {
    return res.json({ result: false, error: err });
  }
  return res.json({ result: true, data: auctions });
};
