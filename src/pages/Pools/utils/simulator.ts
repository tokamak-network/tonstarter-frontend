import {Contract} from '@ethersproject/contracts';
import {convertNumber} from 'utils/number';
import {DEPLOYED} from 'constants/index';
import * as TOSABI from 'services/abis/TOS.json';
import * as StakeUniswapABI from 'services/abis/StakeUniswapV3.json';
import {ethers} from 'ethers';
import {REACT_APP_MODE} from 'constants/index';
import store from 'store';

const {TOS_ADDRESS, UniswapStaking_Address} = DEPLOYED;

export const getTOSContract = async () => {
  const {library} = store.getState().user.data;
  const StakeUniswap = new Contract(
    UniswapStaking_Address,
    StakeUniswapABI.abi,
    library,
  );

  const totalSupply = await StakeUniswap.totalSupplyCoinage();
  console.log(StakeUniswap);

  console.log(totalSupply.toString());
  console.log(convertNumber({amount: totalSupply.toString(), type: 'ray'}));
};

export const fetchSwapPayload = async () => {
  const {library} = store.getState().user.data;
  const tosBalance = await getSwapInfo(library);
  if (REACT_APP_MODE === 'DEV') {
    return convertNumber({amount: tosBalance});
  } else {
    const wei = ethers.utils.formatUnits(tosBalance, 18);
    const invert = 1 / Number(wei);

    return invert.toFixed(6);
  }
};

const getSwapInfo = async (library: any) => {
  if (library) {
    // const TOS = getTokamakContract('TOS', library);
    const StakeUniswap = new Contract(
      UniswapStaking_Address,
      StakeUniswapABI.abi,
      library,
    );
    const basePrice =
      REACT_APP_MODE === 'DEV' ? '1000000000000000000000000000' : '1000000000';

    let price;
    try {
      price = await StakeUniswap.getPrice(basePrice);
    } catch (e) {
      console.log(e);
    }
    return price;
  }
};
