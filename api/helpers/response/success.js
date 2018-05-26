/***************************************************************************
 *                                                                          *
 * General Success response in standard format                              *
 *                                                                          *
 ***************************************************************************/
module.exports = {
  friendlyName: 'Success Response',
  description: 'Send success response',

  extendedDescription:
    'For all success response we use this standard response transfer',

  inputs: {
    data: {
      friendlyName: 'Data',
      description: 'Data to transfer',
      type: 'ref',
      defaultsTo: null
    }
  },

  exits: {
    success: {
      outputFriendlyName: 'Standard success response',
      outputDescription: 'Standard success response json'
    }
  },

  fn: async function(inputes, exits) {
    return exits.success({
      result: true,
      data: inputes.data
    });
  }
};
