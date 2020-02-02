const Operation = require('src/app/Operation');

class SendOTP extends Operation {
  constructor({ registrationsRepository }) {
    super();
    this.registrationsRepository = registrationsRepository;
  }

  async execute(number) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;

    try {
      const requestId = await this.registrationsRepository.sendOTP(number);

      this.emit(SUCCESS, requestId);
    } catch(error) {
      if(error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

SendOTP.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = SendOTP;
