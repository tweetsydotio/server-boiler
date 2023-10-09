const { CLIENT_URL } = require('../../../../config');
const subscriptionService = require('../../../../service/subscritpion/stripe');
const userService = require('../../../../service/user');
// price_1NdShnCx996FZZgafp9KeIri
// subscriptionService
//   .createStripeSubscription({
//     priceId: 'price_1NdShnCx996FZZgafp9KeIri',
//     quantity: 1,
//     clientReferenceID: JSON.stringify({ id: 'id', host: CLIENT_URL }),
//     // customer: 'cus_OkaWJQ4exLPAhv',
//   })
//   .then((data) => console.log(data.url))
//   .catch((e) => console.error(e));

const stripeCheckout = async (req, res, next) => {
  try {
    let { email, priceId, quantity = 1, customer } = req.body;
    if (email) {
      const haveUser = await userService.findUserByEmail({
        email,
        select: 'stripeCustomerID',
      });
      if (haveUser?.stripeCustomerID) {
        customer = haveUser.stripeCustomerID;
      }
    }
    const subs = await subscriptionService.createStripeSubscription({
      quantity,
      priceId,
      email,
      customer,
      success_url: `${CLIENT_URL}/subscription?success=true`,
      cancel_url: `${CLIENT_URL}/prices?success=false`,
    });
    res.status(201).json({ code: 201, url: subs.url });
  } catch (e) {
    next(e);
  }
};

module.exports = stripeCheckout;
