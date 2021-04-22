const dayjs = require('dayjs');
const express = require('express');
const router = express.Router();
const actions = require('../services/actions');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Cluster Stats' });
});

router.post('/', async function (req, res, next) {
  const stats = actions['cluster']();
  await actions.sendToJandi(getData(stats));
  send(res, 'ok');
});

router.post('/marvin', async (req, res, next) => {
  const key = (req.body) ? req.body.data : '';
  const actionKey = actions.translate(key);
  const action = actions[actionKey];
  console.log(actionKey);
  let result = (typeof action === 'function') ? await action() : '🤖Hmm... but don’t panic!';
  send(res, getData(result));
});

function getData(body) {
  return {
    'body': body,
    "connectColor": "#FAC11B",
    "connectInfo": []
  };
}

function send(res, data) {
  res.set('Accept', 'application/vnd.tosslab.jandi-v2+json');
  res.set('Content-Type', 'application/json');
  res.json(data);
}

const JANDI_SCHEDULE = process.env.JANDI_SCHEDULE;

if (JANDI_SCHEDULE) {
  const schedule = require('node-schedule');
  schedule.scheduleJob(JANDI_SCHEDULE, async function (fireTime) {
    const datetime = dayjs(fireTime).format('MM/DD HH:mm');
    try {
      const stats = await actions['cluster']();
      await actions.sendToJandi(getData(stats + '\n' + datetime));
    } catch (e) {
      console.log(e);
    }
    console.log(datetime, 'The answer to life, the universe, and everything!');
  });
}

module.exports = router;
