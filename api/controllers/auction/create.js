const moment = require('moment');

module.exports = async function create(req, res) {
  try {
    var allParams = req.allParams();
    console.log('receive new auction create', allParams);
    if (!req.isSocket) {
      return res.badRequest();
    }

    if (allParams.room && allParams.minimumAllowedBid) {
      let query = {
        title: allParams.title,
        room: allParams.room,
        minimumAllowedBid: allParams.minimumAllowedBid,
        isActive: allParams.isActive
      };
      if (allParams.isRunning) {
        query = {
          ...query,
          isRunning: true,
          startAt: new Date().getTime(),
          endAt: moment()
            .add('10', 'm')
            .valueOf()
        };
      }
      var auction = await Auction.create(query).meta({ fetch: true });

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
