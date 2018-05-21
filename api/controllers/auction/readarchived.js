module.exports = async function readArchived(req, res) {
  if (!req.isSocket) {
    return res.badRequest();
  }

  try {
    var socketId = sails.sockets.getId(req);
    var partner = await Partner.findOne({ socket: socketId });

    var auctions = [];
    var myAuctions = await sails.sendNativeQuery(
      `select auction from bid where partner = $1 group by auction`,
      [partner.id]
    );

    if (myAuctions && myAuctions.rows) {
      var myAuctionsId = _.pluck(myAuctions.rows, 'auction');

      auctions = await Auction.find({
        where: {
          id: myAuctionsId,
          isRunning: false,
          isActive: true,
          startAt: { '>': 0 },
          endAt: { '>': 0 }
        },
        sort: 'endAt ASC'
      }).populate('room');
    }

    return res.json({ result: true, data: auctions });
  } catch (err) {
    return res.json({ result: false, error: err });
  }
};
