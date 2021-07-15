import {getSigner, getRPC} from 'utils/contract';
import {setTxPending} from 'store/tx.reducer';
import store from 'store';
import {Contract} from '@ethersproject/contracts';
// import {toBN} from 'web3-utils';
import * as StakeTON from 'services/abis/StakeTON.json';

type UnstakeFromLayer2 = {
  userAddress: string | null | undefined;
  amount: string;
  contractAddress: string;
  status: string;
  library: any;
  handleCloseModal: any;
};

const rpc = getRPC();

export const swapWTONtoTOS = async (args: UnstakeFromLayer2) => {
  const {userAddress, amount, contractAddress, library} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  // const ray = '1' + '0'.repeat(27);

  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
  // const amountRay = toBN(amount).mul(toBN(ray));
  const signer = getSigner(library, userAddress);
  const deadline = Date.now() / 1000 + 900;
  try {
    const receipt = await StakeTONContract.connect(signer).exchangeWTONtoTOS(
      amount,
      0,
      parseInt(deadline.toString()),
      0,
      0,
    );
    store.dispatch(setTxPending({tx: true}));
    alert(`Tx sent successfully! Tx hash is ${receipt.hash}`);
    if (receipt) {
      store.dispatch(setTxPending({tx: false}));
    }
  } catch (err) {
    store.dispatch(setTxPending({tx: false}));
    console.log(err);
  }
};
