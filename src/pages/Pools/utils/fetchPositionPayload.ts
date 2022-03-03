import {Contract} from '@ethersproject/contracts';
import * as StakeUniswapABI from 'services/abis/StakeUniswapV3.json';
import {DEPLOYED} from 'constants/index';
import {BigNumber} from 'ethers';

const {UniswapStaking_Address} = DEPLOYED;

export const fetchPositionPayload = async (library: any, account: string) => {
  const res = await getPositionInfo(library, account);
  return res;
};

export const fetchClaimablePayload = async (
  library: any,
  account: string,
  id: string,
) => {
  if (id) {
    const currentTime = Date.now() / 1000;
    //@ts-ignore
    const now = parseInt(currentTime);
    const positionId = BigNumber.from(id);

    const StakeUniswap = new Contract(
      UniswapStaking_Address,
      StakeUniswapABI.abi,
      library,
    );
    const expectedClaimable = await StakeUniswap.expectedPlusClaimableAmount(
      positionId,
      now,
    );
    const miningId = await StakeUniswap.getMiningTokenId(positionId);
    return {
      minable: miningId.miningAmount,
      expected: expectedClaimable.miningAmount,
    };
  }
};

const getPositionInfo = async (library: any, account: string) => {
  if (library && account) {
    const StakeUniswap = new Contract(
      UniswapStaking_Address,
      StakeUniswapABI.abi,
      library,
    );

    const positionIds = await StakeUniswap.getUserStakedTokenIds(account);
    const startTime = await StakeUniswap.saleStartTime();
    const endTime = await StakeUniswap.miningEndTime();
    const result: any = [];
    try {
      for (const positionid of positionIds) {
        const currentTime = Date.now() / 1000;
        //@ts-ignore
        const now = parseInt(currentTime);
        const miningId = await StakeUniswap.getMiningTokenId(positionid);
        const stakedCoinageTokens = await StakeUniswap.stakedCoinageTokens(
          positionid,
        );

        const expectedClaimable =
          await StakeUniswap.expectedPlusClaimableAmount(positionid, now);
        const valueById = {
          positionid,
          ...miningId,
          ...stakedCoinageTokens,
          ...expectedClaimable,
        };

        result.push(valueById);
      }
      return {
        positionData: result,
        saleStartTime: startTime,
        miningEndTime: endTime,
      };
    } catch (e) {
      console.log(e);
    }
  }
};
