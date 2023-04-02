import moment from 'moment';
import truncNumber from 'utils/truncNumber';

// const now = moment().unix();
// const oneMonthGap = 2592000;

const monthGapTimeStamp = (currentTimeStamp: number, monthes: number) => {
  const oneMonthGap = 2592000;
  return currentTimeStamp + oneMonthGap * monthes;
};

export const schedules = (
  vaultType: String,
  tokenAllocation: number,
  public2End: number,
) => {
  let rounds: any[] = [];
  let acc = 0;

  switch (vaultType) {
    case 'Public':
      rounds.push({
        claimRound: 1,
        claimTime: public2End + 1,
        claimTokenAllocation: parseInt((tokenAllocation * 0.075).toString()),
      });
      acc += parseInt((tokenAllocation * 0.075).toString());

      for (let i = 1; i < 18; i++) {
        rounds.push({
          claimRound: i + 1,
          claimTime: monthGapTimeStamp(public2End + 1, i),
          claimTokenAllocation: parseInt((tokenAllocation * 0.0125).toString()),
        });
        acc += parseInt((tokenAllocation * 0.0125).toString());
      }

      rounds.push({
        claimRound: 19,
        claimTime: monthGapTimeStamp(public2End + 1, 18),
        claimTokenAllocation: parseInt(
          (tokenAllocation * 0.3 - acc).toString(),
        ),
      });
      acc += parseInt((tokenAllocation * 0.3 - acc).toString());

      return rounds;

    case 'Initial Liquidity':
      rounds.push({
        claimRound: 1,
        claimTime: public2End + 1,
        claimTokenAllocation: parseInt((tokenAllocation * 0.03).toString()),
      });

      return rounds;

    case 'TOKEN-TOS LP Reward':
      for (let i = 0; i < 18; i++) {
        rounds.push({
          claimRound: i + 1,
          claimTime: monthGapTimeStamp(public2End + 1, i),
          claimTokenAllocation: parseInt(
            (tokenAllocation * 0.00631578).toString(),
          ),
        });
        acc += parseInt((tokenAllocation * 0.00631578).toString());
      }
      rounds.push({
        claimRound: 19,
        claimTime: monthGapTimeStamp(public2End + 1, 18),
        claimTokenAllocation: parseInt(
          (tokenAllocation * 0.12 - acc).toString(),
        ),
      });
      acc += parseInt((tokenAllocation * 0.12 - acc).toString());
      return rounds;

    case 'Ecosystem':
      for (let i = 0; i <= 36; i++) {
        if (i === 0 || i === 12 || i === 24) {
          rounds.push({
            claimRound: i + 1,
            claimTime: monthGapTimeStamp(public2End + 1, i),
            claimTokenAllocation: parseInt(
              (tokenAllocation * 0.042).toString(),
            ),
          });

          acc += parseInt((tokenAllocation * 0.042).toString());
        } else if (i < 36) {
          rounds.push({
            claimRound: i + 1,
            claimTime: monthGapTimeStamp(public2End + 1, i),
            claimTokenAllocation: parseInt(
              (tokenAllocation * 0.0065882).toString(),
            ),
          });
          acc += parseInt((tokenAllocation * 0.0065882).toString());
        } else {
          rounds.push({
            claimRound: i + 1,
            claimTime: monthGapTimeStamp(public2End + 1, i),
            claimTokenAllocation: parseInt(
              (tokenAllocation * 0.35 - acc).toString(),
            ),
          });
          acc += parseInt((tokenAllocation * 0.35 - acc).toString());
        }
      }
      return rounds;

    case 'Team':
      for (let i = 13; i < 48; i++) {
        rounds.push({
          claimRound: i - 12,
          claimTime: monthGapTimeStamp(public2End + 1, i),
          claimTokenAllocation: parseInt(
            (tokenAllocation * 0.0041667).toString(),
          ),
        });
        acc += parseInt((tokenAllocation * 0.0041667).toString());
      }
      rounds.push({
        claimRound: 36,
        claimTime: monthGapTimeStamp(public2End + 1, 48),
        claimTokenAllocation: parseInt(
          (tokenAllocation * 0.15 - acc).toString(),
        ),
      });
      acc += parseInt((tokenAllocation * 0.15 - acc).toString());
      return rounds;

    case 'TON Staker':
      for (let i = 0; i < 36; i++) {
        rounds.push({
          claimRound: i + 1,
          claimTime: monthGapTimeStamp(public2End + 1, i),
          claimTokenAllocation: parseInt(
            (tokenAllocation * 0.0003378).toString(),
          ),
        });
        acc += parseInt((tokenAllocation * 0.0003378).toString());
      }

      rounds.push({
        claimRound: 37,
        claimTime: monthGapTimeStamp(public2End + 1, 36),
        claimTokenAllocation: parseInt(
          (tokenAllocation * 0.0125 - acc).toString(),
        ),
      });
      acc += parseInt((tokenAllocation * 0.0125 - acc).toString());
      return rounds;

    case 'TOS Staker':
      for (let i = 0; i < 36; i++) {
        rounds.push({
          claimRound: i + 1,
          claimTime: monthGapTimeStamp(public2End + 1, i),
          claimTokenAllocation: parseInt(
            (tokenAllocation * 0.0003378).toString(),
          ),
        });
        acc += parseInt((tokenAllocation * 0.0003378).toString());
      }
      rounds.push({
        claimRound: 37,
        claimTime: monthGapTimeStamp(public2End + 1, 36),
        claimTokenAllocation: parseInt(
          (tokenAllocation * 0.0125 - acc).toString(),
        ),
      });
      acc += parseInt((tokenAllocation * 0.0125 - acc).toString());
      return rounds;

    case 'WTON-TOS LP Reward':
      for (let i = 0; i < 36; i++) {
        rounds.push({
          claimRound: i + 1,
          claimTime: monthGapTimeStamp(public2End + 1, i),
          claimTokenAllocation: parseInt(
            (tokenAllocation * 0.0006757).toString(),
          ),
        });
        acc += parseInt((tokenAllocation * 0.0006757).toString());
      }
      rounds.push({
        claimRound: 37,
        claimTime: monthGapTimeStamp(public2End + 1, 36),
        claimTokenAllocation: parseInt(
          (tokenAllocation * 0.025 - acc).toString(),
        ),
      });
      acc += parseInt((tokenAllocation * 0.025 - acc).toString());
     
      return rounds;

    case 'Vesting':
      rounds.push(
        {
          claimRound: 1,
          claimTime: monthGapTimeStamp(public2End + 1, 0),
          claimTokenAllocation: 40,
        },
        {
          claimRound: 2,
          claimTime: monthGapTimeStamp(public2End + 1, 12),
          claimTokenAllocation: 20,
        },
        {
          claimRound: 3,
          claimTime: monthGapTimeStamp(public2End + 1, 24),
          claimTokenAllocation: 20,
        },
        {
          claimRound: 4,
          claimTime: monthGapTimeStamp(public2End + 1, 36),
          claimTokenAllocation: 20,
        },
      );
  }

  return rounds;
};

const getSchedule = (aultType: String, tokenAllocation: number) => {};
