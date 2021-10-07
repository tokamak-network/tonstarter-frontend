import {Contract} from '@ethersproject/contracts';
import {setTx} from 'application';
import {DEPLOYED} from 'constants/index';
import * as TOSABI from 'services/abis/TOS.json';
import {LibraryType} from 'types';
import {getSigner} from 'utils/contract';

export const checkApprove = async (
  account: string,
  library: LibraryType,
  address: string,
): Promise<boolean> => {
  const {TON_ADDRESS} = DEPLOYED;
  const TON_CONTRACT = new Contract(TON_ADDRESS, TOSABI.abi, library);
  const approvedAmount = await TON_CONTRACT.allowance(account, address);
  const userTosBalance = await TON_CONTRACT.balanceOf(account);
  return approvedAmount.gt(userTosBalance) ? true : false;
};

export const getAllowance = async (
  account: string,
  library: any,
  address: string,
) => {
  const {TON_ADDRESS} = DEPLOYED;
  const TON_CONTRACT = new Contract(TON_ADDRESS, TOSABI.abi, library);
  const signer = getSigner(library, account);
  const totalSupply = await TON_CONTRACT.totalSupply();

  const res = await TON_CONTRACT.connect(signer).approve(address, totalSupply);
  return setTx(res);
};
