import * as publicSale from 'services/abis/PublicSale.json';
import {Contract} from '@ethersproject/contracts';
import {LibraryType} from 'types';
import {convertNumber} from 'utils/number';
import {BigNumber} from 'ethers';
import {fetchPoolsURL, fetchRewardsURL} from 'constants/index';
import {PoolData, FetchPoolData, RewardData} from '@Admin/types';

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

const getPoolData = async (): Promise<FetchPoolData[] | undefined> => {
  try {
    const rewardReq = await fetch(fetchPoolsURL)
      .then((res) => res.json())
      .then((result) => result);
    const poolData: PoolData[] = await rewardReq.datas;
    const rewardData = await getRewardData();

    const poolDatas = Promise.all(
      poolData.map(async (data: PoolData) => {
        const {poolAddress} = data;
        const numRewardPrograms = rewardData?.filter((data: RewardData) => {
          return data.poolAddress === poolAddress;
        });
        return {
          ...data,
          numRewardPrograms: numRewardPrograms?.length || 0,
        };
      }),
    );

    return poolDatas;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const getRewardData = async (): Promise<RewardData[] | undefined> => {
  const rewardReq = await fetch(fetchRewardsURL)
    .then((res) => res.json())
    .then((result) => result);
  const rewardData: RewardData[] = await rewardReq.datas;

  return rewardData || undefined;
};

const views = {getSaleAmount, getPoolData, getRewardData};

export default views;
