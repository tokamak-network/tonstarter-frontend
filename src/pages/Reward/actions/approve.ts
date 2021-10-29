import {DEPLOYED} from 'constants/index';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {toastWithReceipt} from 'utils';
import {openToast} from 'store/app/toast.reducer';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import * as TOSABI from 'services/abis/TOS.json';
import {utils, ethers} from 'ethers';
type Approve = { 
    library: any;
    amount: number;
    userAddress: string | null | undefined;
    setAlllowed: any
}

const {TOS_ADDRESS, UniswapStaker_Address} = DEPLOYED;

export const approve = async (args:Approve) => {
    const {library, amount, userAddress, setAlllowed } = args;
    if (userAddress === null || userAddress === undefined || library === undefined) {
        return;
      }

      const tosContract = new Contract(TOS_ADDRESS, TOSABI.abi, library);
      // const totalReward = new BigNumber(Number(amount)).toString();
      const weiAllocated = ethers.utils.parseEther(amount.toString())
      const signer = getSigner(library, userAddress);
      try {
        const receipt = await tosContract
          .connect(signer)
          .approve(UniswapStaker_Address, weiAllocated);
        store.dispatch(setTxPending({tx: true}));
        await receipt.wait();
        if (receipt) {
          toastWithReceipt(receipt, setTxPending, 'Reward');
          checkApproved(library, userAddress, setAlllowed);
          console.log('receipt', receipt);
          
        }
      } catch (err) {
        store.dispatch(setTxPending({tx: false}));
        store.dispatch(
          //@ts-ignore
          openToast({
            payload: {
              status: 'error',
              title: 'Tx fail to send',
              description: `something went wrong`,
              duration: 5000,
              isClosable: true,
            },
          }),
        );
      }

}

export const checkApproved = async (library: any, userAddress: string | null | undefined, setAlllowed: any ) => {
  if (userAddress === null || userAddress === undefined || library === undefined) {
    return;
  }
  const tosContract = new Contract(TOS_ADDRESS, TOSABI.abi, library);
  const signer = getSigner(library, userAddress);
  const allowAmount = await tosContract
        .connect(signer)
        .allowance(userAddress, UniswapStaker_Address);
  setAlllowed(parseInt(allowAmount))
        
}
