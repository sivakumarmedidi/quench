

class Messaging {
  constructor({config}) {
    console.log(process.env.MESSAGING_API_KEY);
    this.msgbrd = require('messagebird')("qH2u4OSx1jmTVWgBBMzS3uAMQ");
  }

  sendMessage(number, message) {
    const params = {
      'originator': 'MXQUENCH',
      'recipients': [
        '+91'+number
      ],
      'body': message
    };

    return new Promise((resolve, reject) => {
      this.msgbrd.messages.create(params, function (err, response) {
        if (err) {
          console.log(err);
          return reject(err);
        }
        console.log(response);
        return resolve(response);
      });
    });
  }
}

module.exports = Messaging;
