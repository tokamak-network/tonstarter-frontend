import {Contract} from '@ethersproject/contracts';
import * as StakeTON from 'services/abis/StakeTON.json';
import {getTokamakContract} from 'utils/contract';
// import {Web3Provider} from '@ethersproject/providers';
import {convertFromWeiToRay, convertNumber} from 'utils/number';
import {DEPLOYED} from 'constants/index';
import {BigNumber} from 'ethers';

type GetEarnedTon = {
  account: string;
  contractAddress: string;
  library: any;
};

export const getEarnedTon = async ({
  account,
  contractAddress,
  library,
}: GetEarnedTon) => {
  const {TokamakLayer2_ADDRESS} = DEPLOYED;

  // const TON_CONTRACT = new Contract(TON_ADDRESS, ERC20.abi, library);
  //     const WTON = new Contract(WTON_ADDRESS, WtonABI.abi, library);
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, library);
  const TON_CONTRACT = getTokamakContract('TON', library);
  const WTON_CONTRACT = getTokamakContract('WTON', library);
  const SEIGMANAGER_CONTRACT = getTokamakContract('SeigManager', library);
  const DEPOSITMANAGER_CONTRACT = getTokamakContract('DepositManager', library);

  return Promise.all([
    TON_CONTRACT.balanceOf(contractAddress),
    WTON_CONTRACT.balanceOf(contractAddress),
    SEIGMANAGER_CONTRACT.stakeOf(TokamakLayer2_ADDRESS, contractAddress),
    DEPOSITMANAGER_CONTRACT.pendingUnstaked(
      TokamakLayer2_ADDRESS,
      contractAddress,
    ),
    StakeTONContract.totalStakedAmount(),
    StakeTONContract.userStaked(account),
  ])
    .then((res) => {
      const a = convertFromWeiToRay(res[0].toString());
      const b = res[1].toString();
      const c = res[2].toString();
      const d = res[3].toString();
      const e = convertFromWeiToRay(res[4].toString());

      const totalSeig = BigNumber.from(a).add(b).add(c).add(d).sub(e);
      const userRatio = res[5].amount.div(res[4]);

      //   console.log(
      //     `TON_CONTRACT.balanceOf(contractAddress) :  ${res[0].toString()}`,
      //   );
      //   console.log(
      //     `WTON_CONTRACT.balanceOf(contractAddress) :  ${res[1].toString()}`,
      //   );
      //   console.log(
      //     `SEIGMANAGER_CONTRACT.stakeOf(TokamakLayer2_ADDRESS, contractAddress) :  ${res[2].toString()}`,
      //   );
      //   console.log(
      //     `DEPOSITMANAGER_CONTRACT.pendingUnstaked(
      //   TokamakLayer2_ADDRESS,
      //   contractAddress,
      // ) :  ${res[3].toString()}`,
      //   );
      //   console.log(
      //     `StakeTONContract.totalStakedAmount()
      // :  ${res[4].toString()}`,
      //   );
      //   console.log(
      //     `StakeTONContract.userStaked(account)
      //  :  ${res[5].amount.toString()}`,
      //   );

      //   console.log(`totalSeig : ${totalSeig.toString()}`);
      //   console.log(`userRatio : ${userRatio.toString()}`);

      //   const rewardTON = totalSeig.mul(userRatio);
      //   console.log('--rewardTON--');
      //   console.log(rewardTON.toString());
      //   console.log(totalSeig);
      //   console.log(res[5]);
      //   console.log(
      //     convertNumber({
      //       amount: totalSeig
      //         .div(10 ** 9)
      //         .mul(res[5].amount)
      //         .div(res[4])
      //         .toString(),
      //     }),
      //   );
      // console.log(convertNumber({amount: rewardTON, type: 'ray'}));
      // return convertNumber({amount: rewardTON, type: 'ray'});
    })
    .catch((e) => console.log(e));
};
