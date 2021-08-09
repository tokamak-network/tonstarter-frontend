import { DEPLOYED } from 'constants/index';
import EthSymbol from 'assets/tokens/ETH-symbol.svg';
import TonSymbol from 'assets/tokens/TON-symbol.svg';
import TosSymbol from 'assets/tokens/TOS-symbol.svg';

const {TON_ADDRESS, TOS_ADDRESS, WTON_ADDRESS} = DEPLOYED

type EthAddressType = '0x0000000000000000000000000000000000000000';
type TonAddressType = typeof TON_ADDRESS;
type TosAddressType = typeof TOS_ADDRESS;
type WtonAddressType = typeof WTON_ADDRESS;
// type WethAddressType = '';

// type TokenTypes = 'eth' | 'ton';

const tokenAddresses: {
  eth: EthAddressType;
  ton: TonAddressType;
  tos: TosAddressType;
  wton: WtonAddressType;
} = {
  eth: '0x0000000000000000000000000000000000000000',
  ton: TON_ADDRESS,
  tos: TOS_ADDRESS,
  wton: WTON_ADDRESS,
};

const tokenInfo = {
  eth: {fullName: 'ethereum', name: 'ETH', symbol: EthSymbol, bg: '#383736'},
  weth: {fullName: 'ethereum', name: 'ETH', symbol: EthSymbol, bg: '#383736'},
  ton: {
    fullName: 'tokamak-network',
    name: 'TON',
    symbol: TonSymbol,
    bg: '#007aff',
  },
  wton: {
    fullName: 'tokamak-network',
    name: 'TON',
    symbol: TonSymbol,
    bg: '#007aff',
  },
  tos: {
    fullName: 'tonstarter',
    name: 'TOS',
    symbol: TosSymbol,
    bg: '#ffffff'
  }
};

export const getPoolName = (token0: string, token1: string): string => {
  return `${token0}-${token1}`;
}

export const checkTokenType = (
  payToken: EthAddressType | TonAddressType | TosAddressType | WtonAddressType,
): any => {
  const tokenType = payToken === tokenAddresses['eth'] ?
            'eth' : payToken === tokenAddresses['ton'] ?
            'ton' : payToken === tokenAddresses['tos'] ?
            'tos' : 'tos';

  switch (tokenType) {
    case 'eth':
      return tokenInfo[tokenType];
    case 'ton':
      return tokenInfo[tokenType];
    case 'tos':
      return tokenInfo[tokenType];
    // case 'wton':
    //   return tokenInfo[tokenType];
    default:
      throw new Error(`There is no token type for ${tokenType}`);
  }
};
