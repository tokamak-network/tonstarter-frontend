import EthSymbol from 'assets/tokens/ETH-symbol.svg';
import TonSymbol from 'assets/tokens/TON-symbol.svg';
import TosSymbol from 'assets/tokens/TOS-symbol.svg';

type EthAddressType = '0x0000000000000000000000000000000000000000';
type TonAddressType = '0x44d4F5d89E9296337b8c48a332B3b2fb2C190CD0';
type TosAddressType = '0x73a54e5c054aa64c1ae7373c2b5474d8afea08bd';
type WtonAddressType = '0x709bef48982bbfd6f2d4be24660832665f53406c';
// type WethAddressType = '';

// type TokenTypes = 'eth' | 'ton';

const tokenAddresses: {
  eth: EthAddressType;
  ton: TonAddressType;
  tos: TosAddressType;
  wton: WtonAddressType;
} = {
  eth: '0x0000000000000000000000000000000000000000',
  ton: '0x44d4F5d89E9296337b8c48a332B3b2fb2C190CD0',
  tos: '0x73a54e5c054aa64c1ae7373c2b5474d8afea08bd',
  wton: '0x709bef48982bbfd6f2d4be24660832665f53406c',
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
