import { Contract } from '@ethersproject/contracts'
import { abi as QuoterABI } from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import * as MULTICALL_ABI from 'services/abis/multicall2.json'
import { useMemo } from 'react'
// import { Quoter} from 'types/v3'
import { getContract } from 'utils/contract'
import { useActiveWeb3React } from './useWeb3'
import ERC20_ABI from 'services/abis/erc20_uni.json'
import ERC20_BYTES32_ABI from 'services/abis/erc20_bytes32.json'


// const QUOTER_ADDRESSES = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';
import {
  QUOTER_ADDRESSES,
  MULTICALL2_ADDRESSES,
} from 'constants/addresses'
// returns null on errors
export function useUniswapContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { library, account, chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, library, chainId, withSignerIfPossible, account]) as T
}

export function useV3Quoter() {
  return useUniswapContract<Contract>(QUOTER_ADDRESSES, QuoterABI)
}
export function useMulticall2Contract() {
  return useUniswapContract<Contract>(MULTICALL2_ADDRESSES, MULTICALL_ABI, false) as Contract
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useUniswapContract<Contract>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useUniswapContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}
