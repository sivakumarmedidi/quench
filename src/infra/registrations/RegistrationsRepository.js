
class RegistrationsRepository {
  constructor({ messageClient, cacheClient }) {
    this.messageClient = messageClient;
    this.cacheClient = cacheClient;
  }

  async sendOTP(number) {
    const requestId = 'optRequestId' + parseInt(Math.random()*100000);
    const OTP = parseInt(Math.random()*1000000);
    const message = `Your OTP for logging into Quench is ${OTP}`;

    await this.messageClient.sendMessage(number, message);

    await this.cacheClient.put(requestId, `${OTP}.${number}`, {expiry: 1000*30});

    return `${requestId}, ${OTP}`;
  }

  async verifyOTP(requestId, receivedOTP) {

    const requestValue = await this.cacheClient.get(requestId);
    const [OTP, number] = requestValue.split('.');
    console.log("----", requestValue, receivedOTP, OTP, receivedOTP === parseInt(OTP));

    if(receivedOTP === parseInt(OTP)) {
      return `${number} verified`;
    } else {
      const error = new Error('ValidationError');
      error.details = ['OTP doesn\'t match'];

      throw error;
    }
  }
}

module.exports = RegistrationsRepository;
