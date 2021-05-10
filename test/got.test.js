const got = require('got');
const actions = require('../services/actions');

test('got post', async () => {
  const data = {
    'data': 'lotto',
  };
  try {
    const response = await got.post(
      'http://localhost:4001/marvin',
      { json: data }
    );
    console.log(response.body);
  } catch (e) {
    console.error(e);
  }
});

test('sendToJandi', async () => {
  await actions.sendToJandi({
    'body': 'hello.',
  });
  // const options = {
  //   headers: {
  //     'Accept': 'application/vnd.tosslab.jandi-v2+json',
  //     'Content-Type': 'application/json'
  //   }
  // };
  // try {
  //   await got.post(process.env.JANDI_INCOMING_WEBHOOK, {
  //     ...options, json: { "body": "[[PizzaHouse]](http://url_to_text) You have a new Pizza order.." }
  //   });
  // } catch (e) {
  //   console.error(e);
  // }
});
