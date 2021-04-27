const dayjs = require('dayjs');
require('dayjs/locale/ko');
const DateUtils = {
  parseDate: function (kostr) {
    const EN_FORMAT = 'YYYY. M. D h:mm:ss a';
    const LONG_FORMAT = 'YYYY-MM-DD HH:mm:ss';
    return dayjs(this.arrange(kostr), EN_FORMAT).format(LONG_FORMAT);
  },
  arrange: function (str) {
    let ampm = '';
    if (str.indexOf('오전') > -1) {
      ampm = ' am';
    }
    if (str.indexOf('오후') > -1) {
      ampm = ' pm';
    }
    const changed = str.replace(/\s(오전|오후)/g, '');
    return changed + ampm;
  }
};

module.exports = DateUtils;
