const sheetdb = require('../lib/sheetdb');
const DateUtils = require('../common/DateUtils');

const stats = {
  getRows: async function () {
    const info = { sheetId: process.env.SHEET_ID, id: process.env.SHEET_GID_RAW };
    const sheet = await sheetdb.getSheet(info);
    return await sheet.getRows();
  },
  getRegionStat: function (data) {
    function getCount(data, region, action) {
      return data.filter(item => {
        return item[1] === region && item[2] === action;
      });
    }

    const gaepoIn = getCount(data, '개포', 'checkIn');
    const gaepoOut = getCount(data, '개포', 'checkOut');
    const gaepoForceOut = getCount(data, '개포', 'forceCheckOut');
    const seochoIn = getCount(data, '서초', 'checkIn');
    const seochoOut = getCount(data, '서초', 'checkOut');
    const seochoForceOut = getCount(data, '서초', 'forceCheckOut');
    return {
      gaepo: { in: gaepoIn.length, out: gaepoOut.length + gaepoForceOut.length },
      seocho: { in: seochoIn.length, out: seochoOut.length + seochoForceOut.length }
    };
  },
  getStats: function (data) {
    const days = {};
    data.forEach(row => {
      const record = row._rawData;
      const datetime = DateUtils.parseDate(record[0]);
      const date = datetime.substr(0, 10);
      if (days[date]) {
        days[date].push(record);
      } else {
        days[date] = [record];
      }
    });
    return days;
  },
  getStatsTotal: async function () {
    const data = await stats.getRows();
    const days = stats.getStats(data);
    const list = Object.keys(days);
    const stat = [];
    list.forEach(day => {
      const dailyStat = stats.getRegionStat(days[day]);
      stat.push({ [day]: dailyStat });
    });
    return stat;
  }
};

module.exports = stats;
