import {useEffect, useState} from 'react';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useBlockNumber} from 'hooks/useBlock';
import {DEPLOYED} from 'constants/index';
import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/ERC20.json';
import {convertNumber} from 'utils/number';
import {Contract} from '@ethersproject/contracts';

export const useERC20 = (
  SALE_CONTRACT: string,
): {
  tonBalance: string;
  wtonBalance: string;
  tonAllowance: string;
  wtonAllowance: string;
  totalAllowance: number;
  callTonApprove: () => Contract;
  callWtonApprove: () => Contract;
} => {
  const {account} = useActiveWeb3React();
  const {blockNumber} = useBlockNumber();

  const [tonBalance, setTonBalance] = useState<string>('0.00');
  const [wtonBalance, setWtonBalance] = useState<string>('0.00');
  const [tonAllowance, setTonAllowance] = useState<string>('0.00');
  const [wtonAllowance, setWTonAllowance] = useState<string>('0.00');
  const [totalAllowance, setTotalAllowance] = useState<number>(0);

  const {TON_ADDRESS, WTON_ADDRESS} = DEPLOYED;

  const TON_CONTRACT = useContract(TON_ADDRESS, ERC20.abi);
  const WTON_CONTRACT = useContract(WTON_ADDRESS, ERC20.abi);

  useEffect(() => {
    async function fetchData() {
      if (account && TON_CONTRACT && WTON_CONTRACT) {
        const tonBlanace = await TON_CONTRACT.balanceOf(account);
        const wtonBlanace = await WTON_CONTRACT.balanceOf(account);
        const allowance = await TON_CONTRACT.allowance(account, SALE_CONTRACT);
        const wtonAllowance = await WTON_CONTRACT.allowance(
          account,
          SALE_CONTRACT,
        );
        const convertedTon = convertNumber({
          amount: tonBlanace.toString(),
          localeString: true,
        }) as string;
        const convertedWton = convertNumber({
          amount: wtonBlanace.toString(),
          localeString: true,
        }) as string;
        const convertedNum = convertNumber({
          amount: allowance.toString(),
          localeString: true,
        }) as string;
        const convertedWtonNum = convertNumber({
          type: 'ray',
          amount: wtonAllowance.toString(),
          localeString: true,
        }) as string;
        const totalAllowanceNum =
          Number(convertedNum.replaceAll(',', '')) +
          Number(convertedWtonNum.replaceAll(',', ''));
        setTonBalance(convertedTon);
        setWtonBalance(convertedWton);
        setTonAllowance(convertedNum);
        setWTonAllowance(convertedWtonNum);
        setTotalAllowance(totalAllowanceNum);
      }
    }
    if (TON_CONTRACT && WTON_CONTRACT && SALE_CONTRACT && account) {
      fetchData();
    }
  }, [TON_CONTRACT, WTON_CONTRACT, account, blockNumber, SALE_CONTRACT]);

  return {
    tonBalance,
    wtonBalance,
    tonAllowance,
    wtonAllowance,
    totalAllowance,
    callTonApprove: () =>
      TON_CONTRACT && TON_CONTRACT.allowance(account, SALE_CONTRACT),
    callWtonApprove: () =>
      WTON_CONTRACT && WTON_CONTRACT.allowance(account, SALE_CONTRACT),
  };
};
