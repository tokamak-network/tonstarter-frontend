import * as publicSale from 'services/abis/PublicSale.json';
import {Contract} from '@ethersproject/contracts';
import {LibraryType} from 'types';
import {convertNumber} from 'utils/number';
import {BigNumber} from 'ethers';
import {fetchRewardsURL} from 'constants/index';
import {FetchReward} from '@Admin/types';

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

const getRewardData = async (): Promise<FetchReward[] | undefined> => {
  const rewardReq = await fetch(fetchRewardsURL)
    .then((res) => res.json())
    .then((result) => result);
  const rewardData: FetchReward[] = await rewardReq.datas;

  return rewardData || undefined;
};

const views = {getSaleAmount, getRewardData};

export default views;
