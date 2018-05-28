# HQ Assignment - Server API

This is a part of this assignment [Github](https://github.com/HQInterview/backend-developer-assignment-v2)

Access other parts of this assignment :
[Server API](https://github.com/hq-test/server-api)
[Admin Panel](https://github.com/hq-test/server-admin)
[Partner Panel](https://github.com/hq-test/server-partners)

### Installation

Server API needs [Node.js](https://nodejs.org/) v8+ to run.
It is based on [Sails.js Framework](http://sailsjs.com).

Install the dependencies and devDependencies and start the server.

```sh
$ mpm install sails -g
$ npm install -d
```

### Configuration & Prestart

Find mysql configuration in this path :

```sh
./config/datastore.js
```

Update with your credentials :

```sh
    adapter: 'sails-mysql',
    url: 'mysql://root:@localhost:3306/hq'
```

Find Auction configuration in thi path :

```sh
./config/custom.js
```

Update to what work for you :

```sh
  /***************************************************************************
   *                                                                          *
   * Custom global variables to control auction behavior                      *
   *                                                                          *
   ***************************************************************************/
  defaultIncrementBidExpirationByMinutes: 1,
  defaultBidDurationByMinutes: 1,
  defaultBidDurationByMiliseconds: 1 * 60 * 1000
```

**Default :** configured to a new Auction duration be 1 Minute and when a new bid come under 1 Min expiration it extend the expiration time 1 Minute more.

### Plugins & Tools

Server API is currently extended with the following plugins.

| Plugin                                 | About                                                                                  |
| -------------------------------------- | -------------------------------------------------------------------------------------- |
| Sails js framework                     | [website](http://sailsjs.com)                                                          |
| mysql driver for sails js              | [Github](https://github.com/balderdashy/sails-mysql)                                   |
| Socket IO implementation with sails js | [Documentation](https://sailsjs.com/documentation/reference/web-sockets/socket-client) |
| Moment                                 | [website](https://momentjs.com/)                                                       |
| Lodash                                 | [website](https://lodash.com/)                                                         |

### Run

You can you sails command to run a sails app :

```sh
$ sails lift
```

Or use node to run it :

```sh
$ node app.js
```

### Tests

```sh
$ npm test
```

### Test Plugins & Tools

Server API is currently extended with the following plugins.

| Plugin                                        | About                                                        |
| --------------------------------------------- | ------------------------------------------------------------ |
| Mocha                                         | [website](https://mochajs.org/)                              |
| Chai                                          | [website](http://www.chaijs.com/)                            |
| Socket IO client implementation with sails js | [Github](https://github.com/balderdashy/sails.io.js?files=1) |

### Links

* [Sails framework documentation](https://sailsjs.com/documentation)
* [Version notes / upgrading](https://sailsjs.com/documentation/upgrading)
* [Deployment tips](https://sailsjs.com/documentation/concepts/deployment)
* [Community support options](https://sailsjs.com/support)
* [Professional / enterprise options](https://sailsjs.com/enterprise)

### Version info

This app was originally generated on Thu May 17 2018 00:39:14 GMT+0430 (+0430) using Sails v1.0.2.
