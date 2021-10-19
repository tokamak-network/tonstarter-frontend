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

type Approve = { 
    library: any;
    amount: number;
    userAddress: string | null | undefined;
}

const {TOS_ADDRESS, UniswapStaker_Address} = DEPLOYED;

export const approve = async (args:Approve) => {
    const {library, amount, userAddress } = args;
    if (userAddress === null || userAddress === undefined || library === undefined) {
        return;
      }

      const tosContract = new Contract(TOS_ADDRESS, TOSABI.abi, library);
      const totalReward = new BigNumber(Number(amount)).toString();
      const signer = getSigner(library, userAddress);
      try {
        const receipt = await tosContract
          .connect(signer)
          .approve(UniswapStaker_Address, totalReward);
        store.dispatch(setTxPending({tx: true}));
        if (receipt) {
          toastWithReceipt(receipt, setTxPending);
          
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
