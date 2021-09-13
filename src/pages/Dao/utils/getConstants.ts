import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTransaction} from 'store/refetch.reducer';
import moment from 'moment';
import {setTx} from 'application';

type GetConstants = {
  library: any;
};

export const getConstants = async (args: GetConstants) => {
  const {library} = args;
  const {LockTOS_ADDRESS} = DEPLOYED;
  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );

  const epochUnit = parseInt(await LockTOSContract.epochUnit());
  const maxTime = parseInt(await LockTOSContract.maxTime());
  
  return { epochUnit, maxTime };
};
