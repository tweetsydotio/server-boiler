const { badRequest } = require('../../utils/error');
const { hashMatched, generateHash } = require('../../utils/hashing');
const { generateToken } = require('../token');
const { findUserByEmail, userExist, createUser, create } = require('../user');
const subscriptionService = require('../../service/subscritpion/stripe');
// Third party google login
const googleLogin = async ({ email }) => {
  const user = await findUserByEmail({ email });
  if (!user || user?.registerType !== 'google') {
    throw badRequest('Invalid Credentials!');
  }

  const payload = {
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return generateToken({ payload });
};

// Third party google register
/**
TODO
stripeCustomerID
 */
const googleRegister = async ({
  email,
  name,
  profilePic,
  status = 'active',
}) => {
  if (!name || !email || !profilePic) {
    throw badRequest('Invalid parameters');
  }
  const hasUser = await userExist({ email });
  if (hasUser) {
    throw badRequest('User already exist');
  }
  const { id: stripeCustomerID } =
    await subscriptionService.customerCreateOnStripe({
      email,
      name,
    });
  const user = await create({
    name,
    email,
    profilePic,
    registerType: 'google',
    stripeCustomerID,
    status,
  });
  const payload = {
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return generateToken({ payload });
};
// username password login

const login = async ({ email, password }) => {
  const user = await findUserByEmail({ email, select: '+password' });
  if (!user || user?.registerType !== 'emailPassword') {
    throw badRequest('Invalid Credentials');
  }

  const matched = await hashMatched(password, user.password);
  if (!matched) {
    throw badRequest('Invalid Credentials');
  }

  const payload = {
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return generateToken({ payload });
};
// username password Register
/**
TODO
stripeCustomerID
 */
const register = async ({ name, email, password, status = 'active' }) => {
  if (!name || !email || !password) {
    throw badRequest('Invalid Parameters!');
  }
  const hasUser = await userExist({ email });
  if (hasUser) {
    throw badRequest('User already exist');
  }

  password = await generateHash(password);
  const { id: stripeCustomerID } =
    await subscriptionService.customerCreateOnStripe({
      email,
      name,
    });

  const user = await createUser({
    name,
    email,
    password,
    stripeCustomerID,
    status,
  });
  const payload = {
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return generateToken({ payload });
};

module.exports = { googleLogin, login, register, googleRegister };
