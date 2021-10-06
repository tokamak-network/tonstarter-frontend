import * as publicSale from 'services/abis/PublicSale.json';
import {Contract} from '@ethersproject/contracts';
import {LibraryType} from 'types';
import {convertNumber} from 'utils/number';

interface I_CallContract {
  library: LibraryType;
  address: string;
}

export async function getTotalExpectSaleAmount(args: I_CallContract) {
  const {library, address} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const res = await PUBLICSALE_CONTRACT.totalExpectSaleAmount();
  const convertedNum = convertNumber({amount: res.toString()});
  return convertedNum;
}
