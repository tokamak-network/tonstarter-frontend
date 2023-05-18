import {snapshotGap} from '@Launch/const';
import {Projects, VaultPublic, VaultSchedule} from '@Launch/types';
import {isArray} from 'lodash';
import {toChecksumAddress} from 'web3-utils';

function validateFormikValues(
  values: Projects['CreateProject'],
  // setDisable: Dispatch<SetStateAction<boolean>>,
  // setDisableForStep2: Dispatch<SetStateAction<boolean>>,
) {
  const fileds: any[] = [];

  //get public vault properties
  const {
    publicRound1Allocation,
    publicRound2Allocation,
    vaultTokenAllocation,
    stosTier,
    claim,
    publicRound2End,
    snapshot,
  } = values.vaults[0] as VaultPublic;

  const step2FilledOut = values.vaults.map((vault: any) => {
    const result: any[] = [];
    const thisFields: any[] = [];
    const keys = Object.keys(vault);

    Object.values(vault).forEach((val, index: number) => {
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
          if (vault.index === 1 || vault.vaultType === 'DAO') {
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

          //For public vault only
          if (vault.index === 0) {
            const {oneTier, twoTier, threeTier, fourTier} = stosTier;
            const numVaultTokenAllocation = Number(vaultTokenAllocation);
            const numPublicRound1Allocation = Number(publicRound1Allocation);
            const numPublicRound2Allocation = Number(publicRound2Allocation);
            const stosTierAllocation =
              Number(oneTier.allocatedToken) +
              Number(twoTier.allocatedToken) +
              Number(threeTier.allocatedToken) +
              Number(fourTier.allocatedToken);

            //for Token tab
            if (
              numVaultTokenAllocation !==
              numPublicRound1Allocation + numPublicRound2Allocation
            ) {
              thisFields.push('publicRound');
            }

            //for Schedule tab
            if (claim) {
              if (claim[0] && claim[0].claimTime !== undefined) {
                //should be publicRound2End < first claimTime
                if (Number(claim[0].claimTime) < Number(publicRound2End)) {
                  thisFields.push('snapshot');
                }
                //publicRound2End must have 8days gap from now on
                if (snapshot && snapshot < snapshotGap) {
                  thisFields.push('snapshot');
                }
              }
            }

            //for sTOS Tier tab
            if (numPublicRound1Allocation !== stosTierAllocation) {
              thisFields.push('stos tier');
            }
          }

          //claimRound
          if (
            isMatchingTotalAllocation === undefined ||
            isMatchingTotalAllocation === 0
          ) {
            thisFields.push('claimTokenAllocation');
            result.push(false);
          }
          if (
            vault.vaultTokenAllocation !== 0 &&
            (vault.vaultTokenAllocation === undefined ||
              isMatchingTotalAllocation !== vault.vaultTokenAllocation)
          ) {
            thisFields.push('vaultTokenAllocation');
            result.push('vaultTokenAllocation', false);
          }

          //need to add validate to compare total and allocation
          val.map((claimSchedule: VaultSchedule, index: number) => {
            if (
              claimSchedule.claimTime === undefined ||
              claimSchedule.claimTokenAllocation === undefined ||
              claimSchedule.claimTime === null ||
              claimSchedule.claimTokenAllocation === null
            ) {
              thisFields.push('claimSchedule');
              result.push(false);
            }

            if (
              publicRound2End &&
              claimSchedule &&
              claimSchedule.claimTime !== undefined &&
              claimSchedule.claimTime < publicRound2End
            ) {
              thisFields.push('claimSchedule');
              return result.push(false);
            }

            return result.push(true);
          });
        }
      }

      if (
        keys[index] !== 'vaultAddress' &&
        keys[index] !== 'poolAddress' &&
        (val === undefined || val === '')
      ) {
        //get key
        //

        return result.push(keys[index], false);
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
