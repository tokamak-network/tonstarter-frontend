import {Projects, VaultSchedule} from '@Launch/types';
import {claim} from '@Pools/actions';
import {isArray} from 'lodash';
import {Dispatch, SetStateAction} from 'react';
import {toChecksumAddress} from 'web3-utils';

function validateFormikValues(
  values: Projects['CreateProject'],
  // setDisable: Dispatch<SetStateAction<boolean>>,
  // setDisableForStep2: Dispatch<SetStateAction<boolean>>,
) {
  const fileds: any[] = [];
  const step2FilledOut = values.vaults.map((vault: any) => {
    const result: any[] = [];
    const thisFields: any[] = [];
    Object.values(vault).forEach((val) => {
      if (typeof val === 'object') {
        //STOS Tier Object handle
        if (val?.hasOwnProperty('oneTier')) {
          for (const property in val) {
            if (
              //@ts-ignore
              val[property].requiredStos === undefined ||
              //@ts-ignore
              val[property].requiredStos === '' ||
              //@ts-ignore
              val[property].allocatedToken === undefined ||
              //@ts-ignore
              val[property].allocatedToken === ''
            ) {
              thisFields.push(property);
              return result.push(false);
            }
            return result.push(true);
          }
        }
        // Claim array handle
        if (isArray(val)) {
          if (vault.index === 1) {
            return result.push(true);
          }

          const isMatchingTotalAllocation = val.reduce(
            (prev, cur: VaultSchedule) => {
              if (
                cur.claimTokenAllocation !== undefined &&
                cur.claimTokenAllocation !== null
              ) {
                return prev + Number(cur?.claimTokenAllocation);
              }
            },
            0,
            // (claimSchedule: VaultSchedule) => {
            //   if (
            //     claimSchedule.claimTokenAllocation !== undefined &&
            //     claimSchedule.claimTokenAllocation !== null
            //   ) {
            //     return (
            //       totalAllocation + Number(claimSchedule?.claimTokenAllocation)
            //     );
            //   }
            // },
          );
          // console.log(vault);
          // console.log(isMatchingTotalAllocation);
          // console.log(vault.vaultTokenAllocation);
          if (
            vault.vaultTokenAllocation !== 0 &&
            (vault.vaultTokenAllocation === undefined ||
              isMatchingTotalAllocation !== vault.vaultTokenAllocation)
          ) {
            thisFields.push('vaultTokenAllocation');
            return result.push(false);
          }
          //need to add validate to compare total and allocation
          val.map((claimSchedule: VaultSchedule) => {
            if (
              claimSchedule.claimTime === undefined ||
              claimSchedule.claimTokenAllocation === undefined ||
              claimSchedule.claimTime === null ||
              claimSchedule.claimTokenAllocation === null
            ) {
              thisFields.push('claimSchedule');
              return result.push(false);
            }
            return result.push(true);
          });
        }
      }
      if (val === undefined || val === '') {
        //get key
        //
        return result.push(false);
      } else {
        return result.push(true);
      }
    });
    fileds.push(thisFields);
    return result.indexOf(false) === -1 ? true : false;
  });

  return {
    result: step2FilledOut.indexOf(false) === -1 ? false : true,
    step2FilledOut,
    fileds,
  };

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
