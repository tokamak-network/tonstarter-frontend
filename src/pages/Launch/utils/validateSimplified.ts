import {Projects, VaultPublic, VaultSchedule} from '@Launch/types';
import {snapshotGap} from '@Launch/const';
import {isArray} from 'lodash';
import {isProduction} from './checkConstants';


function validateSimplifiedFormikValues(
  values: Projects['CreateSimplifiedProject'],
) {
  const fields: any[] = [];
  const fieldsStep2: any[] = [];

  //get public vault properties
  const {
    snapshot,
    whitelistEnd,
    publicRound1,
    publicRound1End,
    publicRound2,
    publicRound2End,
    publicRound1Allocation,
    publicRound2Allocation,
    vaultTokenAllocation,
    stosTier,
    claim,
  } = values.vaults[0] as VaultPublic;

  const step1FilledOut = () => {
    // TODO: Add snapshot validation after testing
    // if (snapshot && snapshot < snapshotGap) {
    //   fields.push(false);
    // } else {
    //   fields.push(true);
    // }

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
      console.log('getDuration', Math.round((end - start)));
      return Math.round((end - start));
    };

    // Is there 2 day gap btw whitelist end ~ publicRound1
    if (isProduction() === false) {
      if (whitelistEnd && publicRound1) {
        getDuration(whitelistEnd, publicRound1) >= 1
          ? fields.push(true)
          : fields.push(false);
      }
  
      // Is there 2 day gap btw publicRound1End ~ publicRound2
      if (publicRound1End && publicRound2) {
        getDuration(publicRound1End, publicRound2) >= 1
          ? fields.push(true)
          : fields.push(false);
      }
    } else {
      if (whitelistEnd && publicRound1) {
        getDuration(whitelistEnd, publicRound1) <=  86400 * 2
          ? fields.push(true)
          : fields.push(false);
      }
  
      // Is there 2 day gap btw publicRound1End ~ publicRound2
      if (publicRound1End && publicRound2) {
        getDuration(publicRound1End, publicRound2) <= 86400 * 2
          ? fields.push(true)
          : fields.push(false);
      }
    }
 

    // Public sale 2 start time should be later than Public sale 1 end time
    if (publicRound2 && publicRound1End && publicRound1End < publicRound2) {
      fields.push(true);
    } else {
      fields.push(false);
    }

    if (values.description !== '' && values.description !== undefined) {
      fields.push(true);
    } else {
      fields.push(false);
    }
    
    const results = fields.filter((field: boolean) => field === false)
    return results.length > 0 ? false : true;
  };

  const step2FilledOut = () => {
    const thisFields: any[] = [];
    // Is Funding target, marketCap, or totalSupply undefined?

    // funding target
    if(values.fundingTarget !== undefined || values.fundingTarget !== 0){
      fieldsStep2.push(true);
    } else {
      fieldsStep2.push(false);
    }

    if (
      values.marketCap !== undefined &&
      values.totalSupply !== undefined
    ) {
      fieldsStep2.push(true);
    } else {
      fieldsStep2.push(false);
    }

    // // For the calculation of Token funding price
    if (values.projectTokenPrice !== undefined) {
      fieldsStep2.push(true);
    } else {
      fieldsStep2.push(false);
    }

    // //  For the calculation of Token Listing Price (DEX)
    if (values.tosPrice !== undefined && !Number.isNaN(values.tosPrice)) {
      fieldsStep2.push(true);
    } else {
      fieldsStep2.push(false);
    }

    values.vaults.map((vault: any) => {
    Object.values(vault).some((val) => {
      if (typeof val === 'object') {
        //STOS Tier Object handle
        if (val?.hasOwnProperty('oneTier')) {
          for (const property in val) {
            // console.log(val);
            
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
              // thisFields.push(property);
              return fieldsStep2.push(false);
            }
            return fieldsStep2.push(true);
          }
        }
        // Claim array handle
        if (isArray(val)) {
          if (vault.index === 1) {
            return fieldsStep2.push(true);
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
          );

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
                fieldsStep2.push(true);
            }else {
              fieldsStep2.push(false);
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
            fieldsStep2.push(false);
          }

          if (
            vault.vaultTokenAllocation !== 0 &&
            (vault.vaultTokenAllocation === undefined ||
              isMatchingTotalAllocation !== vault.vaultTokenAllocation)
          ) {
            thisFields.push('vaultTokenAllocation');
            fieldsStep2.push(false);
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
              fieldsStep2.push(false);
            }

            if (
              publicRound2End &&
              claimSchedule &&
              claimSchedule.claimTime !== undefined &&
              claimSchedule.claimTime < publicRound2End
            ) {
              thisFields.push('claimSchedule');
              return fieldsStep2.push(false);
            }

            return fieldsStep2.push(true);
          });
        }
      }
      // if (val === undefined && val === '') {
      //   return fieldsStep2.push(false);
      // } else {
      //   return fieldsStep2.push(true);
      // }
    }});
    });

    // console.log('Check this fields', thisFields);

  };

  step1FilledOut();
  step2FilledOut();
  const results = fields.filter((field: boolean) => field === false) || fieldsStep2.filter((field: boolean) => field === false);
  
  // console.log('results from validation', results)
  return results.length > 0 ? false : true;
}

export default validateSimplifiedFormikValues;
