import {Contract} from '@ethersproject/contracts';
import {setTx} from 'application';
import {DEPLOYED} from 'constants/index';
import * as TOSABI from 'services/abis/TOS.json';
import {LibraryType} from 'types';
import {getSigner} from 'utils/contract';
import {convertNumber, convertToWei} from 'utils/number';

export const checkApprove = async (
  account: string,
  library: LibraryType,
  address: string,
): Promise<string> => {
  const {TON_ADDRESS} = DEPLOYED;
  const TON_CONTRACT = new Contract(TON_ADDRESS, TOSABI.abi, library);
  const approvedAmount = await TON_CONTRACT.allowance(account, address);
  const result = convertNumber({
    amount: approvedAmount,
  }) as string;
  return result;
};

export const getAllowance = async (args: {
  account: string;
  library: any;
  address: string;
  approveAll: boolean;
  amount?: string;
}) => {
  const {account, library, address, approveAll, amount} = args;
  const {TON_ADDRESS} = DEPLOYED;
  const TON_CONTRACT = new Contract(TON_ADDRESS, TOSABI.abi, library);
  const signer = getSigner(library, account);
  const totalSupply = await TON_CONTRACT.totalSupply();

  const res = await TON_CONTRACT.connect(signer).approve(
    address,
    approveAll === true
      ? totalSupply
      : amount !== undefined
      ? convertToWei(amount)
      : null,
  );
  return setTx(res);
};
