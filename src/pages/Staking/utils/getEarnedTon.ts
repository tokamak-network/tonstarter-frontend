import {Contract} from '@ethersproject/contracts';
import * as StakeTON from 'services/abis/StakeTON.json';
import {getTokamakContract} from 'utils/contract';
import {Web3Provider} from '@ethersproject/providers';
import {BigNumber} from 'ethers';

type GetEarnedTon = {
  account: string;
  contractAddress: string;
  library: Web3Provider;
};

export const getEarnedTon = async ({
  account,
  contractAddress,
  library,
}: GetEarnedTon) => {
  // const {
  //   TON_ADDRESS,
  //   WTON_ADDRESS,
  //   SeigManager_ADDRESS,
  //   DepositManager_ADDRESS,
  // } = DEPLOYED;

  // const TON_CONTRACT = new Contract(TON_ADDRESS, ERC20.abi, library);
  //     const WTON = new Contract(WTON_ADDRESS, WtonABI.abi, library);
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, library);
  const TON_CONTRACT = getTokamakContract('TON', library);
  const WTON_CONTRACT = getTokamakContract('WTON', library);
  const SEIGMANAGER_CONTRACT = getTokamakContract('SeigManager', library);
  const DEPOSITMANAGER_CONTRACT = getTokamakContract('DepositManager', library);

  return Promise.all([
    TON_CONTRACT.balanceof(contractAddress),
    WTON_CONTRACT.balanceof(contractAddress),
    SEIGMANAGER_CONTRACT.stakeOf(contractAddress),
    DEPOSITMANAGER_CONTRACT.pending(contractAddress),
    StakeTONContract.totalStakedAmount(),
  ]).then((res) => {
    const totalSeig = res[0].add(res[1], res[2], res[3]).sub(res[4]);
  });
};
