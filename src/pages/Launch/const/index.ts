import {isProduction} from '@Launch/utils/checkConstants';
import moment from 'moment';

const stosMinimumRequirements = {
  tier1: 600,
  tier2: 1200,
  tier3: 2200,
  tier4: 6000,
};

const snapshotGap = isProduction()
  ? moment().add(8, 'days').unix()
  : moment().add(10, 'minutes').unix();
// const snapshotGap = 0;
const nowTimeStamp = moment().unix();

export {stosMinimumRequirements, snapshotGap, nowTimeStamp};
