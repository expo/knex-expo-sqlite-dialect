/**
 * A workaround to inconsistent setInterval/clearInternval in [tarn.js](https://github.com/Vincit/tarn.js/blob/e33d223831367a264db33e35d4c9381a089e539c/src/Pool.ts#L5)
 */
const timers = require('timers-browserify');

function clearTimeout(timer) {
  if (typeof timer === 'number') {
    globalThis.clearTimeout(timer);
    return;
  }
  timers.clearTimeout(timer);
}

function clearInterval(timer) {
  if (typeof timer === 'number') {
    globalThis.clearInterval(timer);
    return;
  }
  timers.clearInterval(timer);
}

module.exports = {
  ...timers,
  clearTimeout,
  clearInterval,
};
