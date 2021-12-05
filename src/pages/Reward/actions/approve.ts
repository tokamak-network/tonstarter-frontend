import {DEPLOYED} from 'constants/index';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {toastWithReceipt} from 'utils';
import {openToast} from 'store/app/toast.reducer';
import * as TOSABI from 'services/abis/TOS.json';
import {utils, ethers} from 'ethers';
type Approve = { 
    library: any;
    amount: string;
    userAddress: string | null | undefined;
    setAlllowed: any;
    tokenAddress: string
}

const {TOS_ADDRESS, UniswapStaker_Address} = DEPLOYED;

export const approve = async (args:Approve) => {
    const {library, amount, userAddress, setAlllowed, tokenAddress } = args;
    if (userAddress === null || userAddress === undefined || library === undefined) {
        return;
      }
      const contract = new Contract(tokenAddress, TOSABI.abi, library);
      // const totalReward = new BigNumber(Number(amount)).toString();
      const weiAllocated = ethers.utils.parseEther(amount)
      const signer = getSigner(library, userAddress);
      
      try {
        const receipt = await contract
          .connect(signer)
          .approve(UniswapStaker_Address, weiAllocated);
        store.dispatch(setTxPending({tx: true}));
       
        if (receipt) {
          toastWithReceipt(receipt, setTxPending, 'Reward');
          await receipt.wait();
          checkApproved(library, userAddress, setAlllowed,tokenAddress );          
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

export const checkApproved = async (library: any, userAddress: string | null | undefined, setAlllowed: any, tokenAddress: string ) => {
  if (userAddress === null || userAddress === undefined || library === undefined) {
    return;
  }
  const tosContract = new Contract(tokenAddress, TOSABI.abi, library);
  const signer = getSigner(library, userAddress);
  const allowAmount = await tosContract
        .connect(signer)
        .allowance(userAddress, UniswapStaker_Address);
  setAlllowed(parseInt(allowAmount))
  return allowAmount;
        
}
