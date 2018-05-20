module.exports = async function readArchived(req, res) {
  try {
    var auctions = await Auction.find({
      where: {
        isRunning: false,
        isActive: true,
        startAt: { '>': 0 },
        endAt: { '>': 0 }
      },
      sort: 'endAt ASC'
    });
    console.log(auctions);
  } catch (err) {
    return res.json({ result: false, error: err });
  }
  return res.json({ result: true, data: auctions });
};
