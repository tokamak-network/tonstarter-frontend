import {Contract} from '@ethersproject/contracts';
import {setTx} from 'application';
import {DEPLOYED} from 'constants/index';
import * as TOSABI from 'services/abis/TOS.json';
import {getSigner} from 'utils/contract';

export const checkApprove = async (
  account: string,
  library: any,
): Promise<boolean> => {
  const {TOS_ADDRESS, LockTOS_ADDRESS} = DEPLOYED;
  const contract = new Contract(TOS_ADDRESS, TOSABI.abi, library);
  const approvedAmount = await contract.allowance(account, LockTOS_ADDRESS);
  const userTosBalance = await contract.balanceOf(account);
  return approvedAmount.gt(userTosBalance) ? true : false;
};

export const getAllowance = async (account: string, library: any) => {
  const {TOS_ADDRESS, LockTOS_ADDRESS} = DEPLOYED;
  const TOSContract = new Contract(TOS_ADDRESS, TOSABI.abi, library);
  const signer = getSigner(library, account);
  const totalSupply = await TOSContract.totalSupply();

  const res = await TOSContract.connect(signer).approve(
    LockTOS_ADDRESS,
    totalSupply,
  );
  return setTx(res);
};
