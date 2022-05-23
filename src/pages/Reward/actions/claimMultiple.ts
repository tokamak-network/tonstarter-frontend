import {DEPLOYED} from 'constants/index';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {toastWithReceipt} from 'utils';
import {openToast} from 'store/app/toast.reducer';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';

const {UniswapStaker_Address} = DEPLOYED;

export const claimMultiple = async (args: any) => {
  const {library, userAddress, claimTokens} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }

  const signer = getSigner(library, userAddress);

  const uniswapStakerContract = new Contract(
    UniswapStaker_Address,
    STAKERABI.abi,
    library,
  );

  const arrayData = await Promise.all(
    claimTokens.map((token: any) => {
      const data = uniswapStakerContract.interface.encodeFunctionData(
        'claimReward',
        [token.token, userAddress, token.claimable],
      );
      return data;
    }),
  );

  try {
    const receipt = await uniswapStakerContract
      .connect(signer)
      .multicall(arrayData);
    store.dispatch(setTxPending({tx: true}));
    if (receipt) {
      toastWithReceipt(receipt, setTxPending, 'Reward');
    }
  } catch (err) {
    store.dispatch(setTxPending({tx: false}));
    console.log(err);
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
};