const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const RegistrationsController = {
  get router() {
    const router = Router();

    router.use(inject('registrationSerializer'));

    router.get('/otp/:number', inject('sendOTP'), this.sendOTP);
    router.post('/verify/:requestId', inject('verifyOTP'), this.verifyOTP);

    return router;
  },

  sendOTP(req, res, next) {
    const { sendOTP, registrationSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR } = sendOTP.outputs;
    const { number } = req.params;

    sendOTP
      .on(SUCCESS, (requestId) => {
        res
          .status(Status.OK)
          .json(requestId);
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          details: error.details
        });
      })
      .on(ERROR, next);

    sendOTP.execute(number);
  },

  verifyOTP(req, res, next) {
    const { verifyOTP, registrationSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR } = verifyOTP.outputs;
    const { OTP } = req.body;
    const { requestId } = req.params;

    verifyOTP
      .on(SUCCESS, () => {
        res
          .status(Status.OK)
          .json({verified: true});
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          details: error.details
        });
      })
      .on(ERROR, next);

    verifyOTP.execute(requestId, OTP);
  }
};

module.exports = RegistrationsController;
