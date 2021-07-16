import {getTokamakContract} from 'utils/contract';
import {convertNumber} from 'utils/number';

export const fetchSwapPayload = async (
  library: any,
  account: string,
  contractAddress: string,
) => {
  const tosBalance = await getSwapInfo(library, account, contractAddress);

  return convertNumber({
    amount: tosBalance,
  });
};

const getSwapInfo = async (
  library: any,
  account: string,
  contractAddress: string,
) => {
  const TOS = getTokamakContract('TOS');
  let TosBalanceOfContract;
  try {
    TosBalanceOfContract = await TOS.balanceOf(contractAddress);
  } catch (e) {
    console.log(e);
  }
  return TosBalanceOfContract;
};
