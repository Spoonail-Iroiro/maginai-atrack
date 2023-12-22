import maginai from 'maginai';
import { AbilityTracker } from './modules/ability-tracker.js';

const logger = maginai.logging.getLogger('atrack');

function checkMaginaiVersion() {
  if (
    maginai.VERSION === undefined ||
    (maginai.VERSION_INFO[0] == 0 && maginai.VERSION_INFO[1] < 4)
  ) {
    const message =
      'maginaiバージョンが古いためatrackを利用できません。maginai v0.4.0以上が必要です';
    maginai.logToInGameLogDebug('%c[emphasis]' + message);
    throw new Error(message);
  }
}

checkMaginaiVersion();

const tracker = new AbilityTracker();

tracker.init();

// export default tracker;
