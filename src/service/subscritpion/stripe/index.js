const { CLIENT_URL } = require('../../../config');
// const Subscription = require('./subscription.model'),
//   Payment = require('./payment.model'),
//   PaymentSubs = require('./paymentSubs.model'),
const stripe = require('../../../paymentGetway/stripe');
const { badRequest } = require('../../../utils/error');

// const deleteSubscription = (key, value) => {
//   if (['id', '_id'].includes(key)) {
//     return Subscription.findByIdAndDelete(key);
//   } else if (key === 'single') {
//     return Subscription.deleteOne(value);
//   }
// };
// const deletePayment = (key, value) => {
//   if (['id', '_id'].includes(key)) {
//     return Payment.findByIdAndDelete(key);
//   } else if (key === 'single') {
//     return Payment.deleteOne(value);
//   }
// };
// const deletePaymentSubs = (key, value) => {
//   if (['id', '_id'].includes(key)) {
//     return PaymentSubs.findByIdAndDelete(key);
//   } else if (key === 'single') {
//     return PaymentSubs.deleteOne(value);
//   }
// };
const cancelStripeSubs = ({ subsId }) => {
  return stripe.subscriptions.cancel(subsId);
};
const getStripeSubs = ({ id }) => {
  return stripe.subscriptions.retrieve(id);
};
const stripeConst = ({ body, sig, STRIPE_WEBHOOK_SECRET }) => {
  return stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
};
const stripeInvoices = ({ invoice }) => {
  return stripe.invoices.retrieve(invoice);
};

const customerCreateOnStripe = ({ email, name, descritpion }) =>
  stripe.customers.create({
    email,
    name,
    descritpion,
  });

const createStripeCheckout = ({
  mode = 'subscription',
  payment_method_types = ['card'],
  currency = 'usd',
  allow_promotion_codes = true,
  price,
  quantity = 1,
  success_url,
  cancel_url,
  customer,
}) =>
  stripe.checkout.sessions.create(
    {
      mode,
      payment_method_types,
      currency,
      allow_promotion_codes,
      line_items: [
        {
          price,
          quantity,
        },
      ],
      success_url,
      cancel_url,
      customer,
    }
    // {
    //   apiKey: process.env.STRIPE_SECRET_KEY,
    // }
  );

const customerPortal = ({
  customer,
  return_url = CLIENT_URL + '/settings',
}) => {
  return stripe.billingPortal.sessions.create({ customer, return_url });
};

const createCheckout = async (obj) => {
  return stripe.checkout.sessions.create(obj);
};
const createStripeSubscription = async ({
  mode = 'subscription',
  email,
  name,
  descritpion,
  payment_method_types = ['card'],
  currency = 'usd',
  allow_promotion_codes = true,
  priceId,
  quantity = 1,
  success_url = CLIENT_URL,
  cancel_url = `${CLIENT_URL}/prices?subscription=false`,
  customer,
  clientReferenceID,
}) => {
  if (!success_url || !cancel_url || !priceId) {
    throw badRequest(`Invalid parameters!`);
  }
  if (!customer && email) {
    const { id } = await customerCreateOnStripe({ name, email, descritpion });
    customer = id;
  }

  const newObj = {
    mode,
    allow_promotion_codes,
    client_reference_id: clientReferenceID,
    payment_method_types,
    currency,
    line_items: [
      {
        price: priceId,
        quantity,
      },
    ],
    success_url,
    cancel_url,
    customer,
  };
  if (customer) {
    newObj.customer = customer;
  }

  return createCheckout(newObj);
};
// console.log(stripe.billingPortal.configurations.create);
module.exports = {
  createStripeSubscription,
  cancelStripeSubs,
  getStripeSubs,
  stripeConst,
  stripeInvoices,
  customerCreateOnStripe,
  createStripeCheckout,
  createCheckout,
  customerPortal,
};
