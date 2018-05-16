module.exports = {
  attributes: {
    title: {
      type: 'string',
      required: true
    },

    username: {
      type: 'string',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      required: true
    },

    sockets: {
      type: 'json',
      defaultsTo: []
    }
  }
};
