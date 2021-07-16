import {getSigner, getRPC} from 'utils/contract';
import {setTxPending} from 'store/tx.reducer';
import store from 'store';
import {Contract} from '@ethersproject/contracts';
import {ethers} from 'ethers';
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
  console.log(amount)
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
  const amountRay = ethers.utils.formatUnits(amount, -27)
  console.log(amountRay);
  const signer = getSigner(library, userAddress);
  const deadline = Date.now() / 1000 + 900;
  try {
    const receipt = await StakeTONContract.connect(signer).exchangeWTONtoTOS(
      amountRay,
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
