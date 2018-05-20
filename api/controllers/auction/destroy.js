module.exports = async function destroy(req, res) {
  try {
    var allParams = req.allParams();
    console.log('receive delete auction ', allParams);
    if (!req.isSocket) {
      return res.badRequest();
    }

    if (allParams.id) {
      var auction = await Auction.destroy({ id: allParams.id }).meta({
        fetch: true
      });
      console.log('result of delete is', auction);
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
