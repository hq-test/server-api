module.exports = {
  attributes: {
    auction: {
      model: 'auction'
    },

    partner: {
      model: 'partner'
    },

    bidAmount: {
      type: 'number',
      required: true
    },

    status: {
      type: 'string',
      isIn: ['Pending', 'Rejected', 'Approved'],
      defaultsTo: 'Pending'
    }
  }
};
