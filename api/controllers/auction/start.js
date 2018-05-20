module.exports = async function update(req, res) {
  try {
    var allParams = req.allParams();
    console.log('receive start auction ', allParams);
    if (!req.isSocket) {
      return res.badRequest();
    }

    if (allParams.id) {
      var auction = await Auction.update(
        { id: allParams.id },
        {
          startAt: new Date(),
          endAt: new Date(),
          isRunning: true
        }
      ).meta({ fetch: true });
      console.log('result of start is', auction);
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
