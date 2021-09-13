import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {setTx} from 'application';

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
  console.log(LockTOSContract);
  const signer = getSigner(library, account);
  const res = await LockTOSContract.connect(signer).withdrawAll();
  return setTx(res);
};
