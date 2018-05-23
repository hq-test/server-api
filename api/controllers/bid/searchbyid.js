module.exports = async function searchById(req, res) {
  try {
    if (!req.isSocket) {
      return res.badRequest();
    }

    var allParams = req.allParams();

    if (!allParams.id) {
      return res.json({
        result: false,
        error: { message: 'Invalid Bid ID' }
      });
    }

    var socketId = sails.sockets.getId(req);

    var partner = await Partner.findOne({ socket: socketId });

    if (partner) {
      var bid = await Bid.findOne({
        id: allParams.id,
        partner: partner.id
      });

      if (bid) {
        var auction = await Auction.findOne({
          id: bid.auction
        })
          .populate('room')
          .populate('bids', { limit: 1, sort: 'createdAt DESC' });

        console.log('find ---------', { bid, auction });
        return res.json({ result: true, data: { bid, auction } });
      } else {
        return res.json({ result: false, error: { message: 'Not found' } });
      }
    } else {
      return res.json({ result: false, error: { message: 'Invalid partner' } });
    }
  } catch (err) {
    return res.json({ result: false, error: err });
  }
};
