import { DEPLOYED } from 'constants/index';
import EthSymbol from 'assets/tokens/ETH-symbol.svg';
import TonSymbol from 'assets/tokens/TON_symbol.svg';
import TosSymbol from 'assets/tokens/TOS_symbol.svg';
import DocSymbol from 'assets/tokens/DOC_symbol.svg';
import WtonSymbol from 'assets/tokens/WTON_symbol.svg';
import TonSymbolDark from 'assets/tokens/TON_symbolDark.svg';
import TosSymbolDark from 'assets/tokens/TOS_symbolDark.svg';
import DocSymbolDark from 'assets/tokens/DOC_symbolDark.svg';
import AuraSymbol from 'assets/tokens/AURA_symbol.png';
const { TON_ADDRESS, TOS_ADDRESS, WTON_ADDRESS, DOC_ADDRESS, AURA_ADDRESS } = DEPLOYED

type EthAddressType = '0x0000000000000000000000000000000000000000';
type TonAddressType = typeof TON_ADDRESS;
type TosAddressType = typeof TOS_ADDRESS;
type WtonAddressType = typeof WTON_ADDRESS;
type DocAddressType = typeof DOC_ADDRESS;
type AuraAddressType = typeof AURA_ADDRESS;

// type WethAddressType = '';

// type TokenTypes = 'eth' | 'ton';

const tokenAddresses: {
  eth: EthAddressType;
  ton: TonAddressType;
  tos: TosAddressType;
  wton: WtonAddressType;
  doc: DocAddressType;
  aura: AuraAddressType;
} = {
  eth: '0x0000000000000000000000000000000000000000',
  ton: TON_ADDRESS,
  tos: TOS_ADDRESS,
  wton: WTON_ADDRESS,
  doc: DOC_ADDRESS,
  aura: AURA_ADDRESS,
};

const tokenInfo = {
  eth: { fullName: 'ethereum', name: 'ETH', symbol: EthSymbol, bg: '#383736', border: 'none' },
  weth: { fullName: 'ethereum', name: 'ETH', symbol: EthSymbol, bg: '#383736', border: 'none' },
  ton: {
    fullName: 'tokamak-network',
    name: 'TON',
    symbol: TonSymbol,
    bg: '#007aff',
    border: 'none',
  },
  wton: {
    fullName: 'tokamak-network',
    name: 'WTON',
    symbol: WtonSymbol,
    bg: 'transparent',
    border: 'none',
  },
  tos: {
    fullName: 'tonstarter',
    name: 'TOS',
    symbol: TosSymbol,
    bg: 'transparent',
    border: '1px solid #e7edf3',
  },
  doc: {
    fullName: 'tonstarter',
    name: 'DOC',
    symbol: DocSymbol,
    bg: '#ffffff',
    border: '1px solid #e7edf3',
  },
  aura: {
    fullName: 'aura',
    name: 'AURA',
    symbol: AuraSymbol,
    bg: '#ffffff',
    border: '1px solid #e7edf3',
  }
};
const tokenInfoDark = {
  eth: { fullName: 'ethereum', name: 'ETH', symbol: EthSymbol, bg: '#383736', border: 'none' },
  weth: { fullName: 'ethereum', name: 'ETH', symbol: EthSymbol, bg: '#383736', border: 'none' },
  ton: {
    fullName: 'tokamak-network',
    name: 'TON',
    symbol: TonSymbolDark,
    bg: '#007aff',
    border: 'none',
  },
  wton: {
    fullName: 'tokamak-network',
    name: 'WTON',
    symbol: WtonSymbol,
    bg: 'transparent',
    border: 'none',
  },
  tos: {
    fullName: 'tonstarter',
    name: 'TOS',
    symbol: TosSymbolDark,
    bg: 'transparent',
    border: '1px solid #e7edf3',
  },
  doc: {
    fullName: 'tonstarter',
    name: 'DOC',
    symbol: DocSymbolDark,
    bg: '#ffffff',
    border: '1px solid #e7edf3',
  },
  aura: {
    fullName: 'aura',
    name: 'AURA',
    symbol: AuraSymbol,
    bg: '#ffffff',
    border: '1px solid #e7edf3',
  }
};
export const getPoolName = (token0: string, token1: string): string => {
  return `${token0}-${token1}`;
}

export const checkTokenType = (
  payToken: EthAddressType | TonAddressType | TosAddressType | WtonAddressType,
  colorMode?: string
): any => {
  const tokenType = payToken === tokenAddresses['eth'] ?
    'eth' : payToken === tokenAddresses['ton'] ?
      'ton' : payToken === tokenAddresses['tos'] ?
        'tos' : payToken === tokenAddresses['wton'] ?
          'wton' : payToken === tokenAddresses['doc'] ?
          'doc' : payToken === tokenAddresses['aura'] ? 'aura' : 'tos';
console.log(payToken);
          
          if (colorMode === 'dark') {
            switch (tokenType) {
              case 'eth':
                return tokenInfoDark[tokenType];
              case 'ton':
                return tokenInfoDark[tokenType];
              case 'tos':
                return tokenInfoDark[tokenType];
              case 'wton':
                return tokenInfoDark[tokenType];
              case 'doc': 
              return tokenInfoDark[tokenType];
              case 'aura': 
              return tokenInfoDark[tokenType];
              default:
                throw new Error(`There is no token type for ${tokenType}`);
            }
          }

          else {
            switch (tokenType) {
              case 'eth':
                return tokenInfo[tokenType];
              case 'ton':
                return tokenInfo[tokenType];
              case 'tos':
                return tokenInfo[tokenType];
              case 'wton':
                return tokenInfo[tokenType];
              case 'doc': 
              return tokenInfo[tokenType];
              case 'aura': 
              return tokenInfo[tokenType];
              default:
                throw new Error(`There is no token type for ${tokenType}`);
            }
          }
  
};
