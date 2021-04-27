const dayjs = require('dayjs');

const DateUtils = require('../common/DateUtils');

test('date time', () => {
  expect(DateUtils.arrange('2021. 4. 27 오전 4:05:42')).toBe('2021. 4. 27 4:05:42 am');
  expect(DateUtils.arrange('2021. 4. 27 오후 4:05:42')).toBe('2021. 4. 27 4:05:42 pm');
  const day = dayjs('2021. 4. 27 4:05:42 am', 'YYYY. M. D h:mm:ss a');
  const str = day.format('YYYY-MM-DD HH:mm:ss');
  expect(str).toBe('2021-04-27 04:05:42');
  expect(DateUtils.parseDate('2021. 4. 27 오후 4:05:42')).toBe('2021-04-27 16:05:42');
});
