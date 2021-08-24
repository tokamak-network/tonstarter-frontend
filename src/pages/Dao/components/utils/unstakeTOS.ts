import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTransaction} from 'store/refetch.reducer';

type UnstkaeTOS = {
  account: string;
  library: any;
  handleCloseModal: any;
};

export const unstakeTOS = async (args: UnstkaeTOS) => {
  const {account, library} = args;
  const {LockTOS_ADDRESS} = DEPLOYED;
  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );
  const signer = getSigner(library, account);
  const res = await LockTOSContract.connect(signer).withdrawAll();

  return await res.wait().then((receipt: any) => {
    if (receipt) {
      store.dispatch(
        setTransaction({
          transactionType: 'Dao',
          blockNumber: receipt.blockNumber,
        }),
      );
    }
  });
};
