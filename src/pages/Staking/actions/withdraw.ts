import {getSigner, getRPC} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as StakeTON from 'services/abis/StakeTON.json';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {REACT_APP_TOKAMAK_LAYER2} from 'constants/index';

type Withdraw = {
  userAddress: string | null | undefined;
  contractAddress: string;
  miningEndTime: string;
  library: any;
  handleCloseModal: any;
};

const rpc = getRPC();

export const withdraw = async (args: Withdraw) => {
  const {userAddress, contractAddress, miningEndTime, library} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const currentBlock = await getRPC().getBlockNumber();
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
  const signer = getSigner(library, userAddress);
  const endBlock = Number(miningEndTime);
  if (endBlock > currentBlock) {
    try {
      await StakeTONContract.connect(signer)
        .tokamakProcessUnStaking(REACT_APP_TOKAMAK_LAYER2)
        .then((receipt: any) => {
          alert(`Tx sent successfully! Tx hash is ${receipt?.hash}`);
          store.dispatch(setTxPending({tx: false}));
        });
    } catch (err) {
      store.dispatch(setTxPending({tx: false}));
      console.log(err);
    }
  } else {
    return alert('not withdrawable time.');
  }
};