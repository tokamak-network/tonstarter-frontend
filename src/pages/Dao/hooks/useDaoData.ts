import {useEffect, useState} from 'react';
import {useBlockNumber} from 'hooks/useBlock';
import {TosStakeList} from '@Dao/types/index';
import {useContract} from 'hooks/useContract';
import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {convertNumber} from 'utils/number';
import moment from 'moment';

const useDaoData = () => {
  const [tosStakeList, setTosStakeList] = useState<TosStakeList[] | []>([]);
  const {blockNumber} = useBlockNumber();
  const {account} = useActiveWeb3React();
  const {LockTOS_ADDRESS} = DEPLOYED;

  const LOCKTOS_CONTRACT = useContract(LockTOS_ADDRESS, LockTOSABI.abi);

  useEffect(() => {
    async function fetchData() {
      const tosStakeList = await LOCKTOS_CONTRACT?.locksOf(account);

      if (tosStakeList.length === 0) {
        return [];
      }

      const nowTime = moment().unix();

      const res: TosStakeList[] = await Promise.all(
        tosStakeList.map(async (lockId: any, index: number) => {
          const lockedBalance = await LOCKTOS_CONTRACT?.lockedBalances(
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
          const endDate = moment.unix(endTime).format('YYYY.MM.DD');
          const withdrawn = lockedBalance.withdrawn;

          const sTOSBalance = await LOCKTOS_CONTRACT?.balanceOfLock(lockId);
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

      const result = res.filter((e: TosStakeList) => e.withdrawn === false);
      setTosStakeList(result);
    }
    if (LOCKTOS_CONTRACT) {
      fetchData();
    }
  }, [blockNumber, LOCKTOS_CONTRACT, account]);
  return {tosStakeList};
};

export default useDaoData;