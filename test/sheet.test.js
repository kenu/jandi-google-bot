const DateUtils = require('../common/DateUtils');
const stats = require('../services/stats');

test('sheet', async () => {
  const rows = await stats.getRows();
  expect(rows.length).toBe(450);

  const timestamp = rows[0]._rawData[0];
  expect(DateUtils.parseDate(timestamp)).toBe('2021-05-04 11:48:35');
  const stat = stats.getStats(rows);
  const days = Object.keys(stat);
  expect(days.length).toBe(3);
  expect(stat[days[0]].length).toBe(166);
  expect(stat[days[1]].length).toBe(272);
  expect(stat[days[2]].length).toBe(12);
  const region = stats.getRegionStat(stat[days[0]]);
  expect(JSON.stringify(region)).toBe('{"gaepo":{"in":102,"out":4},"seocho":{"in":45,"out":15}}');

  const statTotal = stats.getStatsTotal(rows);
  expect(JSON.stringify(statTotal)).toBe('[{"2021-05-04":{"gaepo":{"in":102,"out":4},"seocho":{"in":45,"out":15}}},{"2021-05-03":{"gaepo":{"in":41,"out":114},"seocho":{"in":44,"out":73}}},{"2021-05-02":{"gaepo":{"in":5,"out":5},"seocho":{"in":1,"out":1}}}]');
});
