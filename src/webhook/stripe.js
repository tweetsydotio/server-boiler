const stripe = require('../paymentGetway/stripe');
// const { sendEmail } = require('@/libs/mailgun');
const userService = require('../service/user');
const subscriptionService = require('../service/subscritpion/stripe');

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(200).send(``);
    }
    const sig = req.headers['stripe-signature'];
    const { STRIPE_WEBHOOK_SECRET } = process.env;
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      STRIPE_WEBHOOK_SECRET
    );

    const eventType = event.type;
    if (eventType === 'checkout.session.completed') {
      const dataObject = event.data.object;
      const {
        customer,
        subscription,
        customer_details: { name, email },
        client_reference_id,
        invoice,
        expires_at,
      } = dataObject;
      const user = await userService.findSingleItem({
        qry: { $or: [{ stripeCustomerID: customer }, { email }] },
      });
      if (user) {
        user.stripeCustomerID = customer;
        user.endDate = expires_at * 1000;
        await user.save();
        return res.send();
      } else {
        // //////////////////////////////////////////////////////////////////////////////////// have to create subs intance
        const newObj = {
          status: 'active',
          email,
          name,
          stripeCustomerID: customer,
          endDate: expires_at * 1000,
        };
      }
    }
    res.sendStatus(400);
  } catch (e) {
    console.log(JSON.stringify(e.payload), 'err');
  }
};
/**
 * const event = {
  id: 'evt_1NzKsdCx996FZZga2X1jFA7T',
  object: 'event',
  api_version: '2022-08-01',
  created: 1696863383,
  data: {
    object: {
      id: 'cs_test_b19Tt0AqB7SdZUdcoBAXGVJ2D8OS3IYwcfWq59EDS2JalVzZLx3AqqAHto',
      object: 'checkout.session',
      after_expiration: null,
      allow_promotion_codes: true,
      amount_subtotal: 1000,
      amount_total: 1000,
      automatic_tax: { enabled: false, status: null },
      billing_address_collection: null,
      cancel_url: 'http://localhost:3000/prices?subscription=false',
      client_reference_id: '{"id":"id","host":"http://localhost:3000"}',
      consent: null,
      consent_collection: null,
      created: 1696863342,
      currency: 'usd',
      currency_conversion: null,
      custom_fields: [],
      custom_text: {
        shipping_address: null,
        submit: null,
        terms_of_service_acceptance: null,
      },
      customer: 'cus_Omui4qU8JMp2F2',
      customer_creation: 'always',
      customer_details: {
        address: {
          city: null,
          country: 'BD',
          line1: null,
          line2: null,
          postal_code: null,
          state: null,
        },
        email: 'tahertweetsy@gmail.com',
        name: 'Taher',
        phone: null,
        tax_exempt: 'none',
        tax_ids: [],
      },
      customer_email: null,
      expires_at: 1696949742,
      invoice: 'in_1NzKsbCx996FZZga0aa20nJg',
      invoice_creation: null,
      livemode: false,
      locale: null,
      metadata: {},
      mode: 'subscription',
      payment_intent: null,
      payment_link: null,
      payment_method_collection: 'always',
      payment_method_configuration_details: null,
      payment_method_options: null,
      payment_method_types: ['card'],
      payment_status: 'paid',
      phone_number_collection: { enabled: false },
      recovered_from: null,
      setup_intent: null,
      shipping_address_collection: null,
      shipping_cost: null,
      shipping_details: null,
      shipping_options: [],
      status: 'complete',
      submit_type: null,
      subscription: 'sub_1NzKsbCx996FZZganLHKYQq4',
      success_url: 'http://localhost:3000',
      total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
      url: null,
    },
  },
  livemode: false,
  pending_webhooks: 1,
  request: { id: null, idempotency_key: null },
  type: 'checkout.session.completed',
};
const dataObject = event.data.object;
const {
  customer,
  subscription,
  customer_details: { name, email },
  client_reference_id,
  expires_at,
} = dataObject;
console.log(customer);
 */
