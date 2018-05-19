module.exports = async function create(req, res) {
  // Get the `userId` parameter from the request.
  // This could have been set on the querystring, in
  // the request body, or as part of the URL used to
  // make the request.
  var userId = req.param('userId');

  // Look up the user whose ID was specified in the request.
  var user = await Partner.findOne({ id: userId });

  // If no user was found, redirect to signup.
  if (!user) {
    return res.json({ name: 'invalid user' });
  } else {
    // Display the welcome view, setting the view variable
    // named "name" to the value of the user's name.
    return res.json(user);
  }
};
