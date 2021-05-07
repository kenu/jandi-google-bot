const got = require('got');
const DateUtils = require('../common/DateUtils');
const stats = require('../services/stats');

test('sheet', async () => {
  const rows = await stats.getRows();
  const timestamp = rows[rows.length - 1 ]._rawData[0];
  expect(DateUtils.parseDate(timestamp)).toBe('2021-05-06 12:17:26');

  const stat = stats.getStats(rows);
  const days = Object.keys(stat);
  expect(days.length).toBe(2);
  const region = stats.getRegionStat(stat[days[0]]);
});

test('cluster.42seoul.io', async () => {
  const data = await stats.getStatus();
  expect(data.length).toBe(2);
  expect(data[0]).not.toBe(0);
});
