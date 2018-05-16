module.exports = {
  attributes: {
    auction: {
      model: 'auction'
    },

    partner: {
      model: 'partner'
    },

    bidAmount: {
      type: integer,
      required: true,
      defaultsTo: 0
    },

    status: {
      type: string,
      required: true,
      enum: ['Pending', 'Rejected', 'Approved'],
      defaultsTo: 'Pending'
    }
  }
};
