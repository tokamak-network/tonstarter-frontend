import {Projects, VaultPublic} from '@Launch/types';
import {snapshotGap} from '@Launch/const';

function validateSimplifiedFormikValues(
  values: Projects['CreateSimplifiedProject'],
) {
  const fields: any[] = [];

  //get step 1 public vault properties
  const {
    snapshot,
    whitelistEnd,
    publicRound1,
    publicRound1End,
    publicRound2,
    publicRound2End,
  } = values.vaults[0] as VaultPublic;

  const step1FilledOut = () => {
    if (snapshot && snapshot < snapshotGap) {
      fields.push(false);
    } else {
      fields.push(true);
    }

    // Public sale 1 should be later than snapshot
    if (publicRound1 && snapshot && snapshot < publicRound1) {
      fields.push(true);
    } else {
      fields.push(false);
    }

    // Public sale 1 should be later than whitelist
    if (publicRound1 && whitelistEnd && whitelistEnd < publicRound1) {
      fields.push(true);
    } else {
      fields.push(false);
    }

    const getDuration = (start: any, end: any) => {
      console.log('getDuration', Math.round((end - start) / 86400));
      return Math.round((end - start) / 86400);
    };

    // Is there 2 day gap btw publicRound1 ~ publicRound1End
    if (publicRound1 && publicRound1End) {
      getDuration(publicRound1, publicRound1End) <= 2
        ? fields.push(true)
        : fields.push(false);
    }

    // Is there 2 day gap btw publicRound2 ~ publicRound2End
    if (publicRound2 && publicRound2End) {
      getDuration(publicRound2, publicRound2End) <= 2
        ? fields.push(true)
        : fields.push(false);
    }

    // Public sale 2 start time should be later than Public sale 1 end time
    if (publicRound2 && publicRound1End && publicRound1End < publicRound2) {
      fields.push(true);
    } else {
      fields.push(false);
    }

    if (values.description !== '<p><br></p>') {
      fields.push(true);
    } else {
      fields.push(false);
    }
  };
  step1FilledOut();
  const results = fields.filter((field: boolean) => field === false);
  return results.length > 0 ? false : true;
}

export default validateSimplifiedFormikValues;
