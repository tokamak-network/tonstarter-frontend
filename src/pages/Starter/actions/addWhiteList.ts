import {DEPLOYED} from 'constants/index';
import * as publicSale from 'services/abis/PublicSale.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {setTx} from 'application';
import {LibraryType} from 'types';

type AddWhiteList = {
  account: string;
  library: LibraryType;
};

export const addWhiteList = async (args: AddWhiteList) => {
  const {account, library} = args;
  const {PublicSale_ADDRESS} = DEPLOYED;
  const PUBLICSALE_CONTRACT = new Contract(
    PublicSale_ADDRESS,
    publicSale.abi,
    library,
  );
  const signer = getSigner(library, account);
  const res = await PUBLICSALE_CONTRACT.connect(signer).addWhiteList();
  return setTx(res);
};
