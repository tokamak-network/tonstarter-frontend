import {useEffect, useState} from 'react';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useBlockNumber} from 'hooks/useBlock';
import {DEPLOYED} from 'constants/index';
import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/ERC20.json';
import {convertNumber, convertToRay, convertToWei} from 'utils/number';
import {setTx} from 'application';

export const useERC20 = (
  SALE_CONTRACT: string,
): {
  tonBalance: string;
  wtonBalance: string;
  tonAllowance: string;
  wtonAllowance: string;
  totalAllowance: number;
  originTonAllowance: string;
  originWtonAllowance: string;
  callTonApprove: (amount: string, approveAll?: boolean) => Promise<void>;
  callWtonApprove: (amount: string, approveAll?: boolean) => Promise<void>;
  callTonDecreaseAllowance: () => Promise<void>;
  callWtonDecreaseAllowance: () => Promise<void>;
} => {
  const {account, library} = useActiveWeb3React();
  const {blockNumber} = useBlockNumber();

  const [tonBalance, setTonBalance] = useState<string>('0.00');
  const [wtonBalance, setWtonBalance] = useState<string>('0.00');
  const [tonAllowance, setTonAllowance] = useState<string>('0.00');
  const [wtonAllowance, setWTonAllowance] = useState<string>('0.00');
  const [totalAllowance, setTotalAllowance] = useState<number>(0);
  const [originTonAllowance, setOriginTonAllowance] = useState<string>('0');
  const [originWtonAllowance, setOriginWtonAllowance] = useState<string>('0');

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
          type: 'ray',
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
        setOriginTonAllowance(allowance.toString());
        setOriginWtonAllowance(wtonAllowance.toString());
      }
    }
    if (TON_CONTRACT && WTON_CONTRACT && SALE_CONTRACT && account) {
      fetchData();
    }
  }, [
    TON_CONTRACT,
    WTON_CONTRACT,
    account,
    library,
    blockNumber,
    SALE_CONTRACT,
  ]);

  const callTonApprove = async (
    amount: string,
    approveAll?: boolean,
  ): Promise<void> => {
    // const ton = ethers.utils.formatEther(
    //   tonAllowance.replaceAll('.', '').replaceAll(',', ''),
    // );
    // const totalApprove = Number(ton) + Number(amount);
    const approval_TON_Amount = convertToWei(amount.toString());
    const totallSupply = await TON_CONTRACT?.totalSupply();
    const receipt = TON_CONTRACT?.approve(
      SALE_CONTRACT,
      approveAll ? totallSupply : approval_TON_Amount,
    );
    return setTx(receipt);
  };

  const callWtonApprove = async (
    amount: string,
    approveAll?: boolean,
  ): Promise<void> => {
    // const wton = ethers.utils.formatUnits(
    //   wtonAllowance.replaceAll('.', '').replaceAll(',', ''),
    //   27,
    // );
    // const totalApprove = Number(wton) + Number(amount);
    const approval_WTON_Amount = convertToRay(amount.toString());
    const totallSupply = await WTON_CONTRACT?.totalSupply();
    const receipt = await WTON_CONTRACT?.approve(
      SALE_CONTRACT,
      approveAll ? totallSupply : approval_WTON_Amount,
    );
    return setTx(receipt);
  };

  const callTonDecreaseAllowance = async (): Promise<void> => {
    const tonAllowance = await TON_CONTRACT?.allowance(account, SALE_CONTRACT);
    const receipt = TON_CONTRACT?.decreaseAllowance(
      SALE_CONTRACT,
      tonAllowance,
    );
    return setTx(receipt);
  };

  const callWtonDecreaseAllowance = async (): Promise<void> => {
    const wtonAllowance = await WTON_CONTRACT?.allowance(
      account,
      SALE_CONTRACT,
    );
    const receipt = WTON_CONTRACT?.decreaseAllowance(
      SALE_CONTRACT,
      wtonAllowance,
    );
    return setTx(receipt);
  };

  return {
    tonBalance,
    wtonBalance,
    tonAllowance,
    wtonAllowance,
    totalAllowance,
    originTonAllowance,
    originWtonAllowance,
    callTonApprove,
    callWtonApprove,
    callTonDecreaseAllowance,
    callWtonDecreaseAllowance,
  };
};
