import {Projects} from '@Launch/types';
import {toChecksumAddress} from 'web3-utils';

function validateFormikValues(values: Projects['CreateProject']) {
  // console.log('validate');
  // console.log(values);
  if (values.owner) {
    try {
      const result = toChecksumAddress(String(values.owner));
      if (!result) {
        return {owner: 'err'};
      }
    } catch (e) {
      // console.log(e);
      return {owner: 'err'};
    }
  }
}

export default validateFormikValues;
