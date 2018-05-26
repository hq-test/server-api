/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {
  /***************************************************************************
   *                                                                          *
   * Any other custom config this Sails app should use during development.    *
   *                                                                          *
   ***************************************************************************/
  // mailgunDomain: 'transactional-mail.example.com',
  // mailgunSecret: 'key-testkeyb183848139913858e8abd9a3',
  // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
  // …

  /***************************************************************************
   *                                                                          *
   * Custom global variables to control auction behavior                      *
   *                                                                          *
   ***************************************************************************/
  defaultIncrementBidExpirationByMinutes: 1,
  defaultBidDurationByMinutes: 1,
  defaultBidDurationByMiliseconds: 1 * 60 * 1000
};
