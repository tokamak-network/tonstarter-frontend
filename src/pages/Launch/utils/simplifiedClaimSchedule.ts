import moment from 'moment';

const now = moment().unix();
const oneMonthGap = 2592000;

const monthGapTimeStamp = (currentTimeStamp: number, monthes: number) => {
  const oneMonthGap = 2592000;
  return currentTimeStamp + (oneMonthGap * monthes);
};

export const schedules = (vaultType: String, tokenAllocation: number, public2End: number) => {
  let rounds: any[] = [];
  switch (vaultType) {
    case 'Public':
      for (let i = 0; i <= 18; i++) {
        if (i === 0) {
          rounds.push({
            claimRound: 1,
            claimTime: public2End+1,
            claimTokenAllocation: tokenAllocation * 0.075,
          });
        } else {
          rounds.push({
            claimRound: i + 1,
            claimTime: monthGapTimeStamp(public2End+1, i),
            claimTokenAllocation: tokenAllocation * 0.0125,
          });
        }
      }
      return rounds;

    case 'Initial Liquidity':
      rounds.push({
        claimRound: 1,
        claimTime: public2End+1,
        claimTokenAllocation: tokenAllocation * 0.03,
      });

      return rounds;

    case 'TOKEN-TOS LP Reward':
      for (let i = 0; i <= 18; i++) {
        rounds.push({
          claimRound: i + 1,
          claimTime: monthGapTimeStamp(public2End+1, i),
          claimTokenAllocation: tokenAllocation * 0.00631578,
        });
      }
      return rounds;

    case 'Ecosystem':
      for (let i = 0; i <= 36; i++) {
        if (i === 0 || i === 12 || i === 24) {
          rounds.push({
            claimRound: i + 1,
            claimTime: monthGapTimeStamp(public2End+1, i),
            claimTokenAllocation: tokenAllocation * 0.042,
          });
        } else {
          rounds.push({
            claimRound: i + 1,
            claimTime: monthGapTimeStamp(public2End+1, i),
            claimTokenAllocation: tokenAllocation * 0.0065882,
          });
        }
      }
      return rounds;

    case 'Team':
      for (let i = 13; i <= 48; i++) {
        rounds.push({
          claimRound: i - 12,
          claimTime: monthGapTimeStamp(public2End+1, i),
          claimTokenAllocation: tokenAllocation * 0.0041667,
        });
      }
      return rounds;

    case 'TON Staker':
      for (let i = 0; i <= 36; i++) {
        rounds.push({
          claimRound: i + 1,
          claimTime: monthGapTimeStamp(public2End+1, i),
          claimTokenAllocation: tokenAllocation * 0.0003378,
        });
      }
      return rounds;

    case 'TOS Staker':
      for (let i = 0; i <= 36; i++) {        
        rounds.push({
          claimRound: i + 1,
          claimTime: monthGapTimeStamp(public2End+1, i),
          claimTokenAllocation: tokenAllocation * 0.0003378,
        });
      }
      return rounds;

    case 'WTON-TOS LP Reward':
      for (let i = 0; i <= 36; i++) {
        rounds.push({
          claimRound: i + 1,
          claimTime: monthGapTimeStamp(public2End+1, i),
          claimTokenAllocation: tokenAllocation * 0.0006757,
        });
      }
      return rounds;

      case 'Vesting': 
      rounds.push(
        {claimRound: 1, claimTime: monthGapTimeStamp(public2End+1, 0), claimTokenAllocation: 40},
        {claimRound: 2, claimTime: monthGapTimeStamp(public2End+1, 12), claimTokenAllocation: 20},
        {claimRound: 3, claimTime: monthGapTimeStamp(public2End+1, 24), claimTokenAllocation: 20},
        {claimRound: 4, claimTime: monthGapTimeStamp(public2End+1, 36), claimTokenAllocation: 20},
      )
  }

  return rounds;
};

const getSchedule = (aultType: String, tokenAllocation: number) => {};
