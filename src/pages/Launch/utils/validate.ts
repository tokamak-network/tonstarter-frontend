import {Projects, VaultSchedule} from '@Launch/types';
import {Dispatch, SetStateAction} from 'react';
import {toChecksumAddress} from 'web3-utils';

function validateFormikValues(
  values: Projects['CreateProject'],
  setDisable: Dispatch<SetStateAction<boolean>>,
  setDisableForStep2: Dispatch<SetStateAction<boolean>>,
) {
  const step1 = [
    'projectName',
    'description',
    'tokenName',
    'tokenSymbol',
    'totalSupply',
    'owner',
    'sector',
  ];

  const step1FilledOut = step1.map((e: any) => {
    //@ts-ignore
    const isFilledOut = typeof values[e];
    //@ts-ignore
    if (isFilledOut !== 'undefined' && values[e] !== '') {
      return true;
    }
    return false;
  });

  const step2FilledOut = values.vaults.map((vault: any) => {
    Object.values(vault).forEach((val) => {
      if (val !== undefined && val !== '') {
        return true;
      }
      return false;
    });
    // for (const key in vault) {
    //   const thisKeyValue = vault[key];
    //   const thisKeyType = typeof thisKeyValue;
    //   console.log(key, thisKeyValue, thisKeyType);
    //   // if (thisKeyType === 'object') {
    //   //   thisKeyValue.map((claim: VaultSchedule) => {
    //   //     for (const claimKey in claim) {
    //   //       //@ts-ignore
    //   //       if (claim[claimKey] !== 'undefined' || claim[claimKey] !== '') {
    //   //         return true;
    //   //       }
    //   //       return false;
    //   //     }
    //   //   });
    //   // }
    //   // if (thisKeyType !== 'undefined' && thisKeyValue !== '') {
    //   //   return true;
    //   // }
    //   // return false;
    // }
  });

  if (step1FilledOut.includes(false)) {
    setDisable(true);
  } else {
    setDisable(false);
  }

  // if (step1FilledOut.includes(false)) {
  //   setDisableForStep2(true);
  // } else {
  //   setDisableForStep2(false);
  // }

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
