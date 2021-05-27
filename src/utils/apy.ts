import {formatEther} from '@ethersproject/units';
import {useWeb3React} from '@web3-react/core';
import {getContract} from 'utils/contract';
import * as IERC20 from 'services/abis/IERC20.json';
import {Web3Provider} from '@ethersproject/providers';
import {NumberDecrementStepper} from '@chakra-ui/number-input';

type EthAddress = '0x0000000000000000000000000000000000000000';
type TonAddress = '0x44d4F5d89E9296337b8c48a332B3b2fb2C190CD0';

type TokenTypes = 'eth' | 'ton';

type args = {
  addresses: string[];
  cap: string;
  payToken: EthAddress | TonAddress;
  library: any;
};

type CheckedBalanceType = {
  address: string;
  balance: number;
};

const tokenAddresses: {eth: EthAddress; ton: TonAddress} = {
  eth: '0x0000000000000000000000000000000000000000',
  ton: '0x44d4F5d89E9296337b8c48a332B3b2fb2C190CD0',
};

const getBalance = async (
  addresses: string[],
  tokenType: TokenTypes,
  library: any,
) => {
  const result: any = [];
  const balances = await Promise.all(
    addresses.map(async (address) => {
      console.log(tokenType);
      switch (tokenType) {
        case 'eth':
          // const ethContract = getContract(
          //   tokenAddresses['eth'],
          //   IERC20.abi,
          //   library,
          // );
          // const ethStakingBalance = await ethContract.balanceOf(address);

          break;
        case 'ton':
          const tonContract = getContract(
            tokenAddresses['ton'],
            IERC20.abi,
            library,
          );
          const tonStakingBalance = await tonContract.balanceOf(address);
          const strTonStakingBalance = tonStakingBalance.toString();
          const numTonStakingBalance = Number(strTonStakingBalance);
          if (numTonStakingBalance === 0) {
            return;
          }
          return result.push({
            address: address,
            balance: numTonStakingBalance,
          } as CheckedBalanceType);
        default:
          throw new Error(`There is no token type for ${tokenType}`);
      }
    }),
  );
  return console.log(result);
};

const checkTokenType = (payToken: EthAddress | TonAddress) => {
  const tokenType = payToken === tokenAddresses['eth'] ? 'eth' : 'ton';

  switch (tokenType) {
    case 'eth':
      return 'eth';
    case 'ton':
      return 'ton';
    default:
      throw new Error(`There is no token type for ${tokenType}`);
  }
};

export const calculateApy = async (args: args) => {
  const {addresses, cap, payToken, library} = args;
  const tokenType = await checkTokenType(payToken);
  const balances = await getBalance(addresses, tokenType, library);
  return 'result';
  //   return conertNumber(convertArgs);
};
