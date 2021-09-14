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
  const tosStakeList = await LockTOSContract.locksOf(account);

  if (tosStakeList.length === 0) {
    return [];
  }

  const nowTime = moment().unix();

  const res: TosStakeList[] = await Promise.all(
    tosStakeList.map(async (lockId: any, index: number) => {
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
      const endDate = moment.unix(endTime).format('HH:mm:ss, DD');
      const withdrawn = lockedBalance.withdrawn;

      const sTOSBalance = await LockTOSContract.balanceOfLock(lockId);
      const reward = convertNumber({
        amount: sTOSBalance.toString(),
        localeString: true,
      });
      return {
        lockId,
        periodWeeks,
        periodDays: periodDays + 1,
        end,
        lockedBalance: convertNumber({
          amount: lockedBalance.amount.toString(),
          localeString: true,
        }),
        startTime,
        endTime,
        endDate,
        withdrawn,
        reward,
      };
    }),
  );

  console.log('**LockTOS list**');
  console.log(res);

  return res.filter((e: TosStakeList) => e.withdrawn === false);
};
