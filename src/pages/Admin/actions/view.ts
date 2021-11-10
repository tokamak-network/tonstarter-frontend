import * as publicSale from 'services/abis/PublicSale.json';
import {Contract} from '@ethersproject/contracts';
import {LibraryType} from 'types';
import {convertNumber} from 'utils/number';
import {BigNumber} from 'ethers';

interface I_CallContract {
  library: LibraryType;
  address: string;
}

const getSaleAmount = async (args: I_CallContract) => {
  const {library, address} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const exSaleAmount = await PUBLICSALE_CONTRACT.totalExPurchasedAmount();
  const openSaleAmount = await PUBLICSALE_CONTRACT.totalOpenPurchasedAmount();
  const sum = BigNumber.from(exSaleAmount).add(openSaleAmount);
  const res = convertNumber({amount: sum.toString(), localeString: true});
  return res;
};

const views = {getSaleAmount};

export default views;
