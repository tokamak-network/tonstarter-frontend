import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {toastWithReceipt} from 'utils';
import {DEPLOYED} from 'constants/index';
import * as StakeVault from 'services/abis/Stake1Logic.json';

type Endsale = {
  userAddress: string | null | undefined;
  vaultContractAddress: string;
  library: any;
};

export const closeSale = async (args: Endsale) => {
  const {userAddress, vaultContractAddress, library} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }

  const stakeVault = new Contract(
    DEPLOYED.Stake1Proxy_ADDRESS,
    StakeVault.abi,
    library,
  );
  const signer = getSigner(library, userAddress);
  console.log(stakeVault);
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
    console.log(err.message);
    console.log(err);
  }
};
