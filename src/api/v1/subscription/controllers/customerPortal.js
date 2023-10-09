const { CLIENT_URL } = require('../../../../config');
const subscriptionService = require('../../../../service/subscritpion/stripe');
const userService = require('../../../../service/user');

const customerPortal = async (req, res, next) => {
  try {
    let { stripeCustomerID } = req.user;
    const { url } = await subscriptionService.customerPortal({
      customer: stripeCustomerID,
    });
    res.status(201).json({ code: 201, url });
  } catch (e) {
    next(e);
  }
};

module.exports = customerPortal;
