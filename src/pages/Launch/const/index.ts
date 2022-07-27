import moment from 'moment';

const stosMinimumRequirements = {
  tier1: 600,
  tier2: 1200,
  tier3: 2200,
  tier4: 6000,
};

const snapshotGap = moment().add(8, 'days').unix();
const nowTimeStamp = moment().unix();

export {stosMinimumRequirements, snapshotGap, nowTimeStamp};
