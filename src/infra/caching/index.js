const redis = require('redis');

class Caching {
  constructor({config}) {
    this.client = redis.createClient(config.caching.port, config.caching.host);
  }

  put(key, value) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, function(err, value) {
        if(err) {
          return reject(err);
        }

        return resolve(value);
      });
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, function(err, value) {
        if(err) {
          return reject(err);
        }

        return resolve(value);
      });
    });
  }
}

module.exports = Caching;
