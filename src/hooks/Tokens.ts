import { Currency, Token } from '@uniswap/sdk-core'
import { useMemo, useEffect, useState } from 'react'
import { useActiveWeb3React } from './useWeb3'
import {Contract} from '@ethersproject/contracts';
import * as ERC20 from 'services/abis/IERC20.json';

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress: string): Token | undefined {
  const { chainId, library } = useActiveWeb3React()
  
  const address = tokenAddress
  
  const [decimals, setDecimals] = useState(1);
  const [tokenName, setTokenName] = useState('');
  const [symbol, setSymbol] = useState('');
  useEffect(() => {
    async function getTokenInfo() {
      if (tokenAddress) {
        const contract = new Contract(tokenAddress, ERC20.abi, library)
        const decimal = await contract.decimals();
        const name = await contract.name()
        const tokenSymbol = await contract.symbol()
        setDecimals(decimal)
        setTokenName(name)
        setSymbol(tokenSymbol)
      }
    }
    getTokenInfo()

  }, [decimals, tokenName, symbol])
  

  return useMemo(() => {
    if (!chainId || !address) return undefined
    if (decimals) {
      return new Token(
        chainId,
        address,
        decimals,
        symbol,
        tokenName
      )
    }
    return undefined
  }, [
    address,
    chainId,
    decimals,
    symbol,
    tokenName,
  ])
}

export function useCurrency(currencyId: string): Currency | undefined {
  const token = useToken(currencyId)
  return token
}
