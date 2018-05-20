module.exports = async function create(req, res) {
  try {
    var allParams = req.allParams();
    console.log('receive new auction create', allParams);
    if (!req.isSocket) {
      return res.badRequest();
    }

    if (allParams.room && allParams.minimumAllowedBid) {
      var auction = await Auction.create({
        title: allParams.title,
        room: allParams.room,
        minimumAllowedBid: allParams.minimumAllowedBid,
        isActive: allParams.isActive
      }).meta({ fetch: true });
      console.log('result of creation is', auction);
      return res.json({ result: true, data: auction });
    } else {
      return res.json({
        result: false,
        error: { message: 'Invalid required parameters' }
      });
    }
  } catch (err) {
    return res.json({ result: false, error: err });
  }
};
