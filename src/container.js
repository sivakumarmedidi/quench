const { createContainer, asClass, asFunction, asValue } = require('awilix');
const { scopePerRequest } = require('awilix-express');

const config = require('../config');
const Application = require('./app/Application');
const {
  CreateUser,
  GetAllUsers,
  GetUser,
  UpdateUser,
  DeleteUser
} = require('./app/user');

const {
  SendOTP,
  VerifyOTP
} = require('./app/registration');

const UserSerializer = require('./interfaces/http/user/UserSerializer');
const RegistrationSerializer = require('./interfaces/http/registration/RegistrationSerializer');

const Server = require('./interfaces/http/Server');
const router = require('./interfaces/http/router');
const loggerMiddleware = require('./interfaces/http/logging/loggerMiddleware');
const errorHandler = require('./interfaces/http/errors/errorHandler');
const devErrorHandler = require('./interfaces/http/errors/devErrorHandler');
const swaggerMiddleware = require('./interfaces/http/swagger/swaggerMiddleware');

const logger = require('./infra/logging/logger');
const messageClient = require('./infra/messaging');
const cacheClient = require('./infra/caching');
const SequelizeUsersRepository = require('./infra/user/SequelizeUsersRepository');
const RegistrationsRepository = require('./infra/registrations/RegistrationsRepository');
const { database, User: UserModel } = require('./infra/database/models');

const container = createContainer();

// System
container
  .register({
    app: asClass(Application).singleton(),
    server: asClass(Server).singleton()
  })
  .register({
    router: asFunction(router).singleton(),
    logger: asFunction(logger).singleton(),
    messageClient: asClass(messageClient).singleton(),
    cacheClient: asClass(cacheClient).singleton(),
  })
  .register({
    config: asValue(config)
  });

// Middlewares
container
  .register({
    loggerMiddleware: asFunction(loggerMiddleware).singleton()
  })
  .register({
    containerMiddleware: asValue(scopePerRequest(container)),
    errorHandler: asValue(config.production ? errorHandler : devErrorHandler),
    swaggerMiddleware: asValue([swaggerMiddleware])
  });

// Repositories
container.register({
  usersRepository: asClass(SequelizeUsersRepository).singleton(),
  registrationsRepository: asClass(RegistrationsRepository).singleton()
});

// Database
container.register({
  database: asValue(database),
  UserModel: asValue(UserModel)
});

// Operations
container.register({
  createUser: asClass(CreateUser),
  getAllUsers: asClass(GetAllUsers),
  getUser: asClass(GetUser),
  updateUser: asClass(UpdateUser),
  deleteUser: asClass(DeleteUser)
});
container.register({
  sendOTP: asClass(SendOTP),
  verifyOTP: asClass(VerifyOTP),
});

// Serializers
container.register({
  userSerializer: asValue(UserSerializer),
  registrationSerializer: asValue(RegistrationSerializer)
});

module.exports = container;
