import {Projects, VaultSchedule} from '@Launch/types';
import {isArray} from 'lodash';
import {Dispatch, SetStateAction} from 'react';
import {toChecksumAddress} from 'web3-utils';

function validateFormikValues(
  values: Projects['CreateProject'],
  setDisable: Dispatch<SetStateAction<boolean>>,
  setDisableForStep2: Dispatch<SetStateAction<boolean>>,
) {
  const step2FilledOut = values.vaults.map((vault: any) => {
    Object.values(vault).forEach((val) => {
      if (typeof val === 'object') {
        //STOS Tier Object handle
        if (val?.hasOwnProperty('oneTier')) {
          for (const property in val) {
            if (
              //@ts-ignore
              val[property].requiredStos === undefined ||
              //@ts-ignore
              val[property].allocationToken === undefined
            ) {
              return false;
            }
            return true;
          }
        }
        //Claim array handle
        if (isArray(val)) {
          val.map((claimSchedule: VaultSchedule) => {
            if (
              claimSchedule.claimTime === undefined ||
              claimSchedule.claimTokenAllocation === undefined
            ) {
              return false;
            }
            return true;
          });
        }
      }
      if (val !== undefined && val !== '') {
        return false;
      }
      return true;
    });
  });

  console.log(step2FilledOut);

  // if (step1FilledOut.includes(false)) {
  //   setDisableForStep2(true);
  // } else {
  //   setDisableForStep2(false);
  // }

  // if (values.owner) {
  //   try {
  //     const result = toChecksumAddress(String(values.owner));
  //     if (!result) {
  //       return {owner: 'err'};
  //     }
  //   } catch (e) {
  //     // console.log(e);
  //     return {owner: 'err'};
  //   }
  // }
}

export default validateFormikValues;
