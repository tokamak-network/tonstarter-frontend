import EthSymbol from 'assets/tokens/ETH-symbol.svg';
import TonSymbol from 'assets/tokens/TON-symbol.svg';

type EthAddressType = '0x0000000000000000000000000000000000000000';
type TonAddressType = '0x44d4F5d89E9296337b8c48a332B3b2fb2C190CD0';

type TokenTypes = 'eth' | 'ton';

const tokenAddresses: {eth: EthAddressType; ton: TonAddressType} = {
  eth: '0x0000000000000000000000000000000000000000',
  ton: '0x44d4F5d89E9296337b8c48a332B3b2fb2C190CD0',
};

const tokenInfo = {
  eth: {symbol: EthSymbol, bg: '#383736'},
  ton: {symbol: TonSymbol, bg: '#007aff'},
};

export const checkTokenType = (
  payToken: EthAddressType | TonAddressType,
): any => {
  const tokenType = payToken === tokenAddresses['eth'] ? 'eth' : 'ton';
  switch (tokenType) {
    case 'eth':
      return tokenInfo[tokenType];
    case 'ton':
      return tokenInfo[tokenType];
    default:
      throw new Error(`There is no token type for ${tokenType}`);
  }
};
