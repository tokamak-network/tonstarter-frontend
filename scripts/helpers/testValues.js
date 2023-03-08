// import moment from "moment";

const monthGapTimeStamp = (currentTimeStamp, monthes) => {
    const oneMonthGap = 2629743;
    return currentTimeStamp + oneMonthGap * monthes;
  };
  export const testValue = () => {
    //Plus 15 min to currentTime
    const currentTimeStamp = Math.floor(Date.now() / 1000 + 900);
    // const currentTimeStamp = moment(Date.now()).unix() + 1800;
    // console.log('currentTimestamp from test', currentTimeStamp)
    const round2EndTime = currentTimeStamp + 1200;
    const afterRound2EndTime = round2EndTime + 1;
    const defaultData = {
      projectName: 'vesting_test7',
      description: '<p>testing</p>',
      tokenName: 'test',
      tokenSymbol: 'test',
      totalSupply: '10000000',
      ownerAddress: '0x1A30f49390703c0F0dEFf7d2a6539768003062FA',
      owner: '0x1A30f49390703c0F0dEFf7d2a6539768003062FA',
      isTokenDeployed: false,
      isTokenDeployedErr: false,
      isAllDeployed: false,
      tokenAddress: '',
      tokenType: 'A',
      tokenOwnerAccount: '0x1A30f49390703c0F0dEFf7d2a6539768003062FA',
      tosPrice: '50',
      projectTokenPrice: '100',
      totalTokenAllocation: 6000000,
      sector: 'Defi',
      tokenSymbolImage: '',
      website: '',
      medium: '',
      telegram: '',
      twitter: '',
      discord: '',
      vaults: [
        {
          '0': {
            claimRound: 1,
            claimTokenAllocation: null,
          },
          addressForReceiving: '0x1A30f49390703c0F0dEFf7d2a6539768003062FA',
          adminAddress: '0x1A30f49390703c0F0dEFf7d2a6539768003062FA',
          claim: [
            {
              claimRound: 1,
              claimTime: afterRound2EndTime,
              claimTokenAllocation: 250000,
            },
            {
              claimRound: 2,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 1),
              claimTokenAllocation: 250000,
            },
            {
              claimRound: 3,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 2),
              claimTokenAllocation: 250000,
            },
            {
              claimRound: 4,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 3),
              claimTokenAllocation: 250000,
            },
          ],
          index: 0,
          isDeployed: false,
          isDeployedErr: false,
          isMandatory: true,
          isSet: false,
          stosTier: {
            fourTier: {
              allocatedToken: '125000',
              requiredStos: 6000,
            },
            oneTier: {
              allocatedToken: '125000',
              requiredStos: '600',
            },
            threeTier: {
              allocatedToken: '125000',
              requiredStos: 2200,
            },
            twoTier: {
              allocatedToken: '125000',
              requiredStos: 1200,
            },
          },
          tokenAllocationForLiquidity: 5,
          vaultName: 'Public',
          vaultTokenAllocation: 1000000,
          vaultType: 'Public',
          name: 'Public',
          publicRound1Allocation: '500000',
          publicRound2Allocation: '500000',
          hardCap: '100',
          snapshot: currentTimeStamp,
          whitelist: currentTimeStamp + 300,
          whitelistEnd: currentTimeStamp + 600,
          publicRound1: currentTimeStamp + 601,
          publicRound1End: currentTimeStamp + 900,
          publicRound2: currentTimeStamp + 901,
          publicRound2End: round2EndTime,
        },
        {
          adminAddress: '0x1A30f49390703c0F0dEFf7d2a6539768003062FA',
          claim: [
            {
              claimRound: 1,
            },
          ],
          index: 1,
          isDeployed: false,
          isDeployedErr: false,
          isMandatory: true,
          isSet: false,
          vaultName: 'Initial Liquidity',
          vaultTokenAllocation: 1000000,
          vaultType: 'Initial Liquidity',
          name: 'Initial Liquidity',
          startTime: afterRound2EndTime,
          tokenPair: '',
          tosPrice: '50',
        },
        {
          adminAddress: '',
          claim: [
            {
              claimRound: 1,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 0),
              claimTokenAllocation: 50,
            },
            {
              claimRound: 2,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 1),
              claimTokenAllocation: 16,
            },
            {
              claimRound: 3,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 2),
              claimTokenAllocation: 16,
            },
            {
              claimRound: 4,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 3),
              claimTokenAllocation: 18,
            },
          ],
          index: 2,
          isDeployed: false,
          isDeployedErr: false,
          isMandatory: true,
          isSet: false,
          vaultName: 'Vesting',
          vaultTokenAllocation: 0,
          vaultType: 'Vesting',
        },
        {
          adminAddress: '0x1A30f49390703c0F0dEFf7d2a6539768003062FA',
          claim: [
            {
              claimRound: 1,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 0),
              claimTokenAllocation: 250000,
            },
            {
              claimRound: 2,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 1),
              claimTokenAllocation: 250000,
            },
            {
              claimRound: 3,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 2),
              claimTokenAllocation: 250000,
            },
            {
              claimRound: 4,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 3),
              claimTokenAllocation: 250000,
            },
          ],
          index: 3,
          isDeployed: false,
          isDeployedErr: false,
          isMandatory: true,
          isSet: false,
          vaultName: 'TON Staker',
          vaultTokenAllocation: 1000000,
          vaultType: 'TON Staker',
          name: 'TON Staker',
        },
        {
          adminAddress: '0x1A30f49390703c0F0dEFf7d2a6539768003062FA',
          claim: [
            {
              claimRound: 1,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 0),
              claimTokenAllocation: 250000,
            },
            {
              claimRound: 2,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 1),
              claimTokenAllocation: 250000,
            },
            {
              claimRound: 3,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 2),
              claimTokenAllocation: 250000,
            },
            {
              claimRound: 4,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 3),
              claimTokenAllocation: 250000,
            },
          ],
          index: 4,
          isDeployed: false,
          isDeployedErr: false,
          isMandatory: true,
          isSet: false,
          vaultName: 'TOS Staker',
          vaultTokenAllocation: 1000000,
          vaultType: 'TOS Staker',
          name: 'TOS Staker',
        },
        {
          adminAddress: '0x1A30f49390703c0F0dEFf7d2a6539768003062FA',
          claim: [
            {
              claimRound: 1,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 0),
              claimTokenAllocation: 250000,
            },
            {
              claimRound: 2,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 1),
              claimTokenAllocation: 250000,
            },
            {
              claimRound: 3,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 2),
              claimTokenAllocation: 250000,
            },
            {
              claimRound: 4,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 3),
              claimTokenAllocation: 250000,
            },
          ],
          index: 5,
          isDeployed: false,
          isDeployedErr: false,
          isMandatory: true,
          isSet: false,
          poolAddress: '0x516e1af7303a94f81e91e4ac29e20f4319d4ecaf',
          tokenPair: 'WTON-TOS',
          vaultName: 'WTON-TOS LP Reward',
          vaultTokenAllocation: 1000000,
          vaultType: 'WTON-TOS LP Reward',
          name: 'WTON-TOS LP Reward',
        },
        {
          adminAddress: '0x1A30f49390703c0F0dEFf7d2a6539768003062FA',
          claim: [
            {
              claimRound: 1,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 0),
              claimTokenAllocation: 250000,
            },
            {
              claimRound: 2,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 1),
              claimTokenAllocation: 250000,
            },
            {
              claimRound: 3,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 2),
              claimTokenAllocation: 250000,
            },
            {
              claimRound: 4,
              claimTime: monthGapTimeStamp(afterRound2EndTime, 3),
              claimTokenAllocation: 250000,
            },
          ],
          index: 6,
          isDeployed: false,
          isDeployedErr: false,
          isMandatory: true,
          isSet: false,
          vaultName: 'Liquidity Incentive',
          vaultTokenAllocation: 1000000,
          vaultType: 'Liquidity Incentive',
          name: 'test-TOS LP Reward',
        },
      ],
      salePrice: 0,
    };
    return defaultData;
  };
  