const sheetdb = require('../lib/sheetdb');
const DateUtils = require('../common/DateUtils');

test('sheet', async () => {
  const gid = process.env.SHEET_GID_RAW;
  expect(sheetdb).not.toBe(null);
  expect(process.env.SHEET_ID.length).toBe(44);
  const info = { sheetId: process.env.SHEET_ID, id: gid };
  const sheet = await sheetdb.getSheet(info);
  const rows = await sheet.getRows();
  const len = rows.length;
  const timestamp = rows[0]._rawData[0];
  expect(DateUtils.parseDate(timestamp)).toBe('2021-04-18 23:24:43');
});
