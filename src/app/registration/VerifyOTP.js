const Operation = require('src/app/Operation');

class VerifyOTP extends Operation {
  constructor({ registrationsRepository }) {
    super();
    this.registrationsRepository = registrationsRepository;
  }

  async execute(requestId, OTP) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;

    try {
      await this.registrationsRepository.verifyOTP(requestId, OTP);

      this.emit(SUCCESS);
    } catch(error) {
      if(error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

VerifyOTP.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = VerifyOTP;
