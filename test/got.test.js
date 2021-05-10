const got = require('got');
const { options } = require('../routes');

test('got post', async () => {
  const data = {
    'data': 'lotto',
  };
  try {
    const response = await got.post(
      'http://localhost:4001/marvin',
      {json: data}
    );
    console.log(response.body);
  } catch (e) {
    console.error(e);
  }
});
