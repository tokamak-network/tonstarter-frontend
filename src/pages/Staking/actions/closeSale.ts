import {getSigner, getRPC} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {toastWithReceipt} from 'utils';
import {REACT_APP_STAKE1_PROXY} from 'constants/index';
import * as StakeVault from 'services/abis/Stake1Logic.json';

type Endsale = {
  userAddress: string | null | undefined;
  vaultContractAddress: string;
  miningEndTime: string | Number;
  library: any;
  handleCloseModal: any;
};

const rpc = getRPC();

export const closeSale = async (args: Endsale) => {
  const {userAddress, vaultContractAddress, library} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }

  const stakeVault = await new Contract(
    REACT_APP_STAKE1_PROXY,
    StakeVault.abi,
    rpc,
  );
  const signer = getSigner(library, userAddress);
  try {
    const receipt = await stakeVault
      .connect(signer)
      ?.closeSale(vaultContractAddress);
    store.dispatch(setTxPending({tx: true}));
    if (receipt) {
      toastWithReceipt(receipt, setTxPending);
    }
  } catch (err) {
    store.dispatch(setTxPending({tx: false}));
    console.log(err);
  }
};