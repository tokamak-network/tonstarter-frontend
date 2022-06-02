import {fetchPoolsURL, fetchRewardsURL, fetchTokensURL} from 'constants/index';
import {FetchPoolData, PoolData, TokensData, interfaceReward} from './types/index'
import {getTokenSymbol} from './utils/getTokenSymbol';
// import {getSigner} from 'utils/contract';
// import {Contract} from '@ethersproject/contracts';

// import * as ERC20 from 'services/abis/ERC20.json';

const getPoolData = async (library: any): Promise<FetchPoolData[] | undefined> => {
    try {
      const rewardReq = await fetch(fetchPoolsURL)
        .then((res) => res.json())
        .then((result) => result);
      const poolData: PoolData[] = await rewardReq.datas;
      const rewardData = await getRewardData();
  
      const poolDatas = Promise.all(
        poolData.map(async (data: PoolData) => {
          const {poolAddress, token0Address, token1Address} = data;
          const numRewardPrograms = rewardData?.filter((data: interfaceReward) => {
            return data.poolAddress === poolAddress;
          });          
          const token0Symbol = await getTokenFromContract(token0Address,library);
          const token1Symbol = await getTokenFromContract(token1Address,library);
          
          
          return {
            ...data,
            numRewardPrograms: numRewardPrograms?.length || 0,
            token0Symbol: token0Symbol,
            token1Symbol: token1Symbol
          };
        }),
      );
  
      return poolDatas;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  };
  const getTokenFromContract = async (address: string, library: any) => {
    const symbolContract = await getTokenSymbol(address, library);
    return symbolContract;
  };

  const getTokensData = async (): Promise<TokensData[] | undefined> => {
    try {
      const tokensReq = await fetch(fetchTokensURL)
        .then((res) => res.json())
        .then((result) => result)
      const tokensData: TokensData[] = await tokensReq.datas;

      if (tokensData !== undefined) {
        return tokensData
      } else {
        return []
      }
    } catch (e) {
      console.log(e)
      return undefined
    }
  }

  const getPoolDataWithoutReward = async (): Promise<PoolData[] | undefined> => {
    try {
      const poolReq = await fetch(fetchPoolsURL)
        .then((res) => res.json())
        .then((result) => result)
      const poolData: PoolData[] = await poolReq.datas;

      if (poolData !== undefined) {
        return poolData
      } else {
        return []
      }
    } catch (e) {
      console.log(e)
      return undefined
    }
  }



  const getRewardData = async (): Promise<interfaceReward[] | undefined> => {
    const rewardReq = await fetch(fetchRewardsURL)
      .then((res) => res.json())
      .then((result) => result);
    const rewardData: interfaceReward[] = await rewardReq.datas;
  
    if (rewardData !== undefined) {
      return rewardData
    }
    else {
      return []
    }
  };  

  const views = {getPoolData, getRewardData, getTokensData, getPoolDataWithoutReward};

export default views;