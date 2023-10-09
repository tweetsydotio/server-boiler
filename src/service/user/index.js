const User = require('../../model/User');
const defaults = require('../../config/defaults');
const { badRequest } = require('../../utils/error');

const findUserByEmail = async ({ email, select }) => {
  const user = await User.findOne({ email }).select(select).exec();
  return user ? user : false;
};

const findSingleItem = async ({ qry, select }) => {
  const user = await User.findOne(qry).select(select).exec();
  return user ? user : false;
};
const userExist = async ({ email, select }) => {
  const user = await findUserByEmail({ email, select });
  return user ? true : false;
};

const createUser = async ({
  name,
  email,
  password,
  registerType = 'emailPassword',
  stripeCustomerID,
  profilePic,
}) => {
  if (!name || !email || !stripeCustomerID || !password)
    throw badRequest('Invalid parameters');

  const user = new User({
    name,
    email,
    password,
    registerType,
    stripeCustomerID,
    profilePic,
  });
  await user.save();

  return { ...user._doc, id: user.id };
};

/**
 * Find all users
 * filtering
 * sorting
 * pagination
 * Admin access only
 * @param {Object} options - The options for querying users.
 * @param {number} [options.page=defaults.page] - The page number for pagination.
 * @param {number} [options.limit=defaults.limit] - The number of users per page.
 * @param {string} [options.sortType=defaults.sortType] - The sorting type.
 * @param {string} [options.sortBy=defaults.sortBy] - The field to sort by.
 * @param {string} [options.name=''] - Filter users by name.
 * @param {string} [options.email=''] - Filter users by email.
 * @returns {Promise<Object>} - A promise that resolves with the find all users data.
 */
const findAllItems = async ({
  page = defaults.page,
  limit = defaults.limit,
  sortType = defaults.sortType,
  sortBy = defaults.sortBy,
  name = '',
  email = '',
}) => {
  const sortStr = `${sortType === 'dsc' ? '-' : ''}${sortBy}`;
  const filter = {
    name: { $regex: name, $options: 'i' },
    email: { $regex: email, $options: 'i' },
  };

  const users = await User.find(filter)
    .sort(sortStr)
    .skip(page * limit - limit)
    .limit(limit);

  return users.map((user) => ({
    ...user._doc,
    id: user.id,
  }));
};

/**
 * Count users based on provided filters.
 * @param {Object} filters - The filters for counting users.
 * @param {string} [filters.name=''] - Filter users by name.
 * @param {string} [filters.email=''] - Filter users by email.
 * @returns {Promise<number>} - A promise that resolves with the count of matching users.
 */
const count = async ({ name = '', email = '' }) => {
  const filter = {
    name: { $regex: name, $options: 'i' },
    email: { $regex: email, $options: 'i' },
  };

  return User.count(filter);
};

/**
 * Create a new user with the provided information.
 * Admin access only
 * @param {Object} userData - The data for creating a new user.
 * @param {string} userData.name - The name of the user.
 * @param {string} userData.email - The email of the user.
 * @returns {Promise<Object>} - A promise that resolves with the created user's data, including the generated id.
 * @throws {Error} Throws an error if any of the required parameters (name, email, password) are missing.
 */
const create = async ({
  name,
  email,
  role = 'user',
  status = 'pending',
  password,
  registerType,
  stripeCustomerID,
  profilePic,
}) => {
  if (!name || !email || !stripeCustomerID)
    throw badRequest('Invalid parameters');
  const newObj = {
    name,
    email,
    role,
    status,
    registerType,
    stripeCustomerID,
    profilePic,
  };
  if (password) newObj.password = password;
  const user = new User(newObj);
  await user.save();

  return { ...user._doc, id: user.id };
};

module.exports = {
  userExist,
  findUserByEmail,
  createUser,
  findAllItems,
  findSingleItem,
  create,
  count,
};
