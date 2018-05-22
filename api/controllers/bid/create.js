module.exports = async function create(req, res) {
  try {
    var allParams = req.allParams();
    console.log('------------- receive new bid create', allParams);
    if (!req.isSocket) {
      return res.badRequest();
    }

    if (allParams.auction && allParams.partner && allParams.bidAmount) {
      var auction = await Auction.findOne({
        id: allParams.auction,
        isActive: true,
        isRunning: true
      }).populate('bids', {
        where: { status: 'Pending' },
        limit: 1,
        sort: 'createdAt ASC'
      });

      if (auction) {
        // it is an active and live auction and allow to get bid on it
        var allowCreateBid = false;
        var minBid = auction.minimumAllowedBid;
        if (auction.bids.length) {
          if (allParams.bidAmount > auction.bids[0].bidAmount) {
            allowCreateBid = true;
          } else {
            minBid = auction.bids[0].bidAmount;
          }
        } else {
          if (allParams.bidAmount > auction.minimumAllowedBid) {
            allowCreateBid = true;
          }
        }

        if (allowCreateBid) {
          // create new bid
          var bid = await Bid.findOrCreate(
            {
              auction: allParams.auction,
              partner: allParams.partner,
              bidAmount: allParams.bidAmount
            },
            {
              auction: allParams.auction,
              partner: allParams.partner,
              bidAmount: allParams.bidAmount
            }
          );

          console.log(
            '-------------  check update old bid',
            'bids count',
            auction.bids.length
          );

          if (auction.bids.length) {
            // update last bid and notify it lose
            console.log('-------------  update old bid');
            await Bid.update(
              { id: auction.bids[0].id },
              {
                status: 'Rejected'
              }
            ).meta({ fetch: true });
          }
          return res.json({ result: true, data: bid });
        } else {
          return res.json({
            result: false,
            error: {
              message: `Your bid amount is not valid, it must be greater than ${minBid} BHT.`
            }
          });
        }
      } else {
        // auction is not valid
        return res.json({
          result: false,
          error: { message: 'Sorry, Auction is not allowed to receive bid' }
        });
      }
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
