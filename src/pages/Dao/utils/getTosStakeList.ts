import {Contract} from '@ethersproject/contracts';
import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import moment from 'moment';
import {convertNumber} from 'utils/number';
import {TosStakeList} from '../types/index';
import {LibraryType} from 'types/index';

export const getTosStakeList = async ({
  account,
  library,
}: {
  account: string;
  library: LibraryType;
}): Promise<TosStakeList[] | []> => {
  const {LockTOS_ADDRESS} = DEPLOYED;
  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );
  console.log('**LockTOSContract**');
  console.log(LockTOSContract);
  const tosStakeList = await LockTOSContract.activeLocksOf(account);
  console.log(tosStakeList);

  if (tosStakeList.length === 0) {
    return [];
  }

  const nowTime = moment().unix();

  const res: TosStakeList[] = await Promise.all(
    tosStakeList.map(async (stake: any, index: number) => {
      const lockId = stake.id.toString();
      const lockedBalance = await LockTOSContract.lockedBalances(
        account,
        lockId,
      );

      const startTime = Number(lockedBalance.start.toString());
      const endTime = Number(lockedBalance.end.toString());

      const unixStartTime = moment.unix(startTime);
      const unixEndTime = moment.unix(endTime);
      const periodWeeks = unixEndTime.diff(unixStartTime, 'weeks');
      const periodDays = unixEndTime.diff(unixStartTime, 'days');
      const end = endTime <= nowTime;
      const endDate = moment(unixEndTime).format('MMM DD, YYYY');
      const isBoosted =
        lockedBalance.boostValue.toString() === '2' ? true : false;

      return {
        lockId,
        periodWeeks,
        periodDays: periodDays + 1,
        end,
        lockedBalance: convertNumber({amount: lockedBalance.amount.toString()}),
        startTime,
        endTime,
        endDate,
        isBoosted,
      };
    }),
  );

  return res.filter((e: any) => e.lockId !== '0');
};
