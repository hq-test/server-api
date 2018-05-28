var sails = require('sails');

// Before running any tests...
before(function(done) {
  // Increase the Mocha timeout so that Sails has enough time to lift, even if you have a bunch of assets.
  this.timeout(5000);

  sails.lift(
    {
      // Your sails app's configuration files will be loaded automatically,
      // but you can also specify any other special overrides here for testing purposes.

      // For example, we might want to skip the Grunt hook,
      // and disable all logs except errors and warnings:
      hooks: { grunt: false },
      log: { level: 'warn' },
      models: {
        adapter: 'sails-mysql',
        url: 'mysql://root:@localhost:3306/hq',
        migrate: 'drop'
      }
    },
    function(err) {
      if (err) {
        return done(err);
      }

      // here you can load fixtures, etc.
      // (for example, you might want to create some records in the database)
      var socketIOClient = require('socket.io-client');
      var sailsIOClient = require('sails.io.js');

      // Instantiate the socket client (`io`)
      // (for now, you must explicitly pass in the socket.io client when using this library from Node.js)
      var io = sailsIOClient(socketIOClient);
      //console.log('0', io);

      // Set some options:
      // (you have to specify the host and port of the Sails backend when using this library from Node.js)
      io.sails.url = 'http://localhost:1337';
      //console.log('1', io);

      sails.config.clientIo = io;
      return done(null, sails);
    }
  );
});

// After all tests have finished...
after(function(done) {
  // here you can clear fixtures, etc.
  // (e.g. you might want to destroy the records you created above)

  // When you are finished with `io.socket`, or any other sockets you connect manually,
  // you should make sure and disconnect them, e.g.:
  //io.socket.disconnect();

  sails.lower(done);
});
