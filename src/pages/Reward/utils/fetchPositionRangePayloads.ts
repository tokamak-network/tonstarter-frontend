import {Contract} from '@ethersproject/contracts';
import * as StakeUniswapABI from 'services/abis/StakeUniswapV3.json';
import * as NPMABI from 'services/abis/NonfungiblePositionManager.json';
import {DEPLOYED} from 'constants/index';

const {UniswapStaking_Address, NPM_Address} = DEPLOYED;

export const fetchPositionRangePayload = async (
  library: any,
  id: string,
  account: string,
  tick: string,
) => {
  if (library === undefined || account === undefined) {
    return;
  }
  const res = await getPositionRange(library, account, id);
  const {tickLower, tickUpper, approved} = res;
  const range = Number(tick) > tickLower && tick < tickUpper;
  return {
    res: res,
    range: range,
    approved: approved,
  };
};

export const fetchPositionRangePayloadModal = async (
  library: any,
  id: string,
  account: string,
) => {
  if (library === undefined || account === undefined) {
    return;
  }
  const res = await getPositionRangeModal(library, account, id);
  const {tick, tickLower, tickUpper, approved} = res;
  const range = Number(tick) > tickLower && tick < tickUpper;
  return {
    res: res,
    range: range,
    approved: approved,
  };
};

const getPositionRange = async (library: any, account: string, id: string) => {
  if (id && library !== undefined) {
    const StakeUniswap = new Contract(
      UniswapStaking_Address,
      StakeUniswapABI.abi,
      library,
    );
    const NPM = new Contract(NPM_Address, NPMABI.abi, library);
    const getApproved = await NPM.isApprovedForAll(
      account,
      UniswapStaking_Address,
    );
    const positions = await NPM.positions(id);

    return {
      ...positions,
      approved: getApproved,
    };
  }
};

const getPositionRangeModal = async (
  library: any,
  account: string,
  id: string,
) => {
  if (id && library !== undefined) {
    const StakeUniswap = new Contract(
      UniswapStaking_Address,
      StakeUniswapABI.abi,
      library,
    );
    const NPM = new Contract(NPM_Address, NPMABI.abi, library);
    const getApproved = await NPM.isApprovedForAll(
      account,
      UniswapStaking_Address,
    );
    const positions = await NPM.positions(id);
    const poolSlot0 = await StakeUniswap.poolSlot0();

    return {
      ...positions,
      ...poolSlot0,
      approved: getApproved,
    };
  }
};
