const { IdToenVerify } = require('../middleware/google/idTokenVerify');
const router = require('express').Router();
const { controllers: authControllers } = require('../api/v1/auth');
const {
  controllers: subscriptionControllers,
} = require('../api/v1/subscription');
const authenticate = require('../middleware/authenticate');

router
  // Auth Routes
  .post(`/api/v1/auth/google/login`, IdToenVerify, authControllers.googleLogin)
  .post(
    `/api/v1/auth/google/register`,
    IdToenVerify,
    authControllers.googleRegister
  )
  .post(`/api/v1/auth/register`, authControllers.register)
  .post(`/api/v1/auth/login`, authControllers.login)
  // Subscription Routes
  .post(
    `/api/v1/subscription/stripe`,
    authenticate,
    subscriptionControllers.stripeCheckout
  );

module.exports = router;
