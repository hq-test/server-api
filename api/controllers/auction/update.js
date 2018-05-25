module.exports = async function update(req, res) {
  try {
    if (!req.isSocket) {
      return res.json({
        result: false,
        error: { message: 'invalid socket request' }
      });
    }

    var allParams = req.allParams();
    console.log('receive update auction ', allParams);

    if (allParams.id && allParams.room && allParams.minimumAllowedBid) {
      var auction = await Auction.update(
        { id: allParams.id },
        {
          title: allParams.title,
          room: allParams.room,
          minimumAllowedBid: allParams.minimumAllowedBid,
          isActive: allParams.isActive
        }
      ).meta({ fetch: true });

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
