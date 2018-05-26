/***************************************************************************
 *                                                                          *
 * General Error response in standard format                                *
 *                                                                          *
 ***************************************************************************/
module.exports = {
  friendlyName: 'Error Response',
  description: 'Send error response',

  extendedDescription:
    'For all error response we use this standard response transfer',

  inputs: {
    error: {
      friendlyName: 'Error Object',
      description: 'Error Object in JSON format',
      type: 'ref',
      defaultsTo: null
    }
  },

  exits: {
    error: {
      outputFriendlyName: 'Standard error response',
      outputDescription: 'Standard error response json'
    }
  },

  fn: async function(inputes, exits) {
    return exits.success({
      result: false,
      error: inputes.error
    });
  }
};
