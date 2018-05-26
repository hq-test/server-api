/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  '/': {
    view: 'pages/homepage'
  },

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/

  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

  /***************************************************************************
   * Partner Routes                                                          *
   ***************************************************************************/
  'get /api/partner/:userId': 'partner/read',
  'post /api/partner/login': 'partner/login',
  'post /api/partner/logout': 'partner/logout',

  /***************************************************************************
   * Auction Routes                                                          *
   ***************************************************************************/
  'get /api/auction/read/all': 'auction/read',
  'get /api/auction/read/live': 'auction/readLive',
  'get /api/auction/read/archived': 'auction/readArchived',
  'post /api/auction/subscribe': 'auction/subscribe',
  'post /api/auction/unsubscribe': 'auction/unsubscribe',
  'post /api/auction/detail/subscribe': 'auction/subscribeDetail',
  'post /api/auction/detail/unsubscribe': 'auction/unsubscribeDetail',
  'post /api/auction/create': 'auction/create',
  'put /api/auction/update': 'auction/update',
  'put /api/auction/start': 'auction/start',
  'delete /api/auction/destroy': 'auction/destroy',

  /***************************************************************************
   * Bid Routes                                                              *
   ***************************************************************************/
  'post /api/bid/create': 'bid/create',
  'post /api/bid/search/id': 'bid/searchById',
  'get /api/bid/read/live': 'bid/readLive',
  'get /api/bid/read/more': 'bid/readMore'

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝

  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝
};
