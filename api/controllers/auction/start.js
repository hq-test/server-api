const moment = require('moment');

module.exports = async function update(req, res) {
  try {
    if (!req.isSocket) {
      return res.json({
        result: false,
        error: { message: 'invalid socket request' }
      });
    }
    var allParams = req.allParams();
    console.log('receive start auction ', allParams);

    if (allParams.id) {
      var auction = await Auction.update(
        { id: allParams.id, isRunning: false },
        {
          startAt: new Date().getTime(),
          endAt: moment()
            .add('1', 'm')
            .valueOf(),
          isRunning: true
        }
      ).meta({ fetch: true });

      console.log('result of start is', auction.length, auction);
      return res.json({ result: true, data: auction.length && auction[0] });
    } else {
      return res.json({
        result: false,
        error: { message: 'Invalid required parameters' }
      });
    }
  } catch (err) {
    console.log('catch', err);
    return res.json({ result: false, error: err });
  }
};
