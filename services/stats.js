const got = require('got');
const sheetdb = require('../lib/sheetdb');
const DateUtils = require('../common/DateUtils');

const stats = {
  getStatus: async function () {
    try {
      const options = {
        headers: { Cookie: process.env.CLUSTER_KEY }
      };
      const response = await got('https://cluster.42seoul.io/api/user/status', options);
      const data = JSON.parse(response.body);
      return [data.gaepo, data.seocho];
    } catch (error) {
      console.log(error.message);
      return [-1, -1];
    }
  },
  getRows: async function () {
    const info = { sheetId: process.env.SHEET_ID, id: process.env.SHEET_GID_RAW };
    const sheet = await sheetdb.getSheet(info);
    return await sheet.getRows();
  },
  getRegionStat: function (data) {
    function getCount(data, action) {
      return data.filter(item => {
        return item[2] === action;
      });
    }

    function getFiltered(data, planetName) {
      const planet = data.filter(item => item.includes(planetName));
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      const p = planet.map(item => item[3]);
      const uniq = p.filter(onlyUnique);
      return { planet, uniq };
    }

    const gaepo = getFiltered(data, '개포');
    const seocho = getFiltered(data, '서초');

    const gaepoIn = getCount(gaepo.planet, 'checkIn');
    const gaepoOut = getCount(gaepo.planet, 'checkOut');
    const gaepoForceOut = getCount(gaepo.planet, 'forceCheckOut');
    const seochoIn = getCount(seocho.planet, 'checkIn');
    const seochoOut = getCount(seocho.planet, 'checkOut');
    const seochoForceOut = getCount(seocho.planet, 'forceCheckOut');
    return {
      gaepo: { in: gaepoIn.length, out: gaepoOut.length + gaepoForceOut.length, uniq: gaepo.uniq.length },
      seocho: { in: seochoIn.length, out: seochoOut.length + seochoForceOut.length, uniq: seocho.uniq.length }
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
