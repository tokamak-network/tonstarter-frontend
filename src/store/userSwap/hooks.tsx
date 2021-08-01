import { Percent, Token } from '@uniswap/sdk-core'
// import { computePairAddress, Pair } from '@uniswap/v2-sdk'
// import JSBI from 'jsbi'
import { useCallback, useMemo } from 'react'

import { useActiveWeb3React } from '../../hooks/useWeb3'
import {
  SerializedToken,
  toggleURLWarning,
  updateUserSingleHopOnly,
  updateUserSlippageTolerance,
} from './actions'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'

function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
  }
}

function deserializeToken(serializedToken: SerializedToken): Token {
  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name
  )
}

export function useUserSingleHopOnly(): [boolean, (newSingleHopOnly: boolean) => void] {
  const dispatch = useAppDispatch()

  const singleHopOnly = useAppSelector((state) => state.userSwap.userSingleHopOnly)

  const setSingleHopOnly = useCallback(
    (newSingleHopOnly: boolean) => {
      dispatch(updateUserSingleHopOnly({ userSingleHopOnly: newSingleHopOnly }))
    },
    [dispatch]
  )

  return [singleHopOnly, setSingleHopOnly]
}

// export function useSetUserSlippageTolerance(): (slippageTolerance: Percent | 'auto') => void {
//   const dispatch = useAppDispatch()

//   return useCallback(
//     (userSlippageTolerance: Percent | 'auto') => {
//       let value: 'auto' | number
//       try {
//         value =
//           userSlippageTolerance === 'auto' ? 'auto' : JSBI.toNumber(userSlippageTolerance.multiply(10_000).quotient)
//       } catch (error) {
//         value = 'auto'
//       }
//       dispatch(
//         updateUserSlippageTolerance({
//           userSlippageTolerance: value,
//         })
//       )
//     },
//     [dispatch]
//   )
// }

/**
 * Return the user's slippage tolerance, from the redux store, and a function to update the slippage tolerance
 */
export function useUserSlippageTolerance(): Percent | 'auto' {
  const userSlippageTolerance = useAppSelector((state) => {
    return state.userSwap.userSlippageTolerance
  })

  return useMemo(
    () => (userSlippageTolerance === 'auto' ? 'auto' : new Percent(userSlippageTolerance, 10_000)),
    [userSlippageTolerance]
  )
}

/**
 * Same as above but replaces the auto with a default value
 * @param defaultSlippageTolerance the default value to replace auto with
 */
export function useUserSlippageToleranceWithDefault(defaultSlippageTolerance: Percent): Percent {
  const allowedSlippage = useUserSlippageTolerance()
  return useMemo(
    () => (allowedSlippage === 'auto' ? defaultSlippageTolerance : allowedSlippage),
    [allowedSlippage, defaultSlippageTolerance]
  )
}

// export function useUserAddedTokens(): Token[] {
//   const { chainId } = useActiveWeb3React()
//   const serializedTokensMap = useAppSelector(({ user: { tokens } }) => tokens)

//   return useMemo(() => {
//     if (!chainId) return []
//     return Object.values(serializedTokensMap?.[chainId] ?? {}).map(deserializeToken)
//   }, [serializedTokensMap, chainId])
// }
