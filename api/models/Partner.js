module.exports = {
  attributes: {
    title: {
      type: string,
      required: true,
      defaultsTo: 'unknown partner'
    },

    username: {
      type: string,
      required: true,
      unique: true
    },

    password: {
      type: string,
      required: true
    },

    sockets: {
      type: array,
      defaultsTo: []
    }
  }
};
