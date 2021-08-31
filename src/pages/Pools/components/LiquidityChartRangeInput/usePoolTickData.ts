import { Currency } from '@uniswap/sdk-core'
import { FeeAmount, Pool, tickToPrice, TICK_SPACINGS } from '@uniswap/v3-sdk'
import JSBI from 'jsbi'
// import { usePool } from './usePools'
import { useMemo } from 'react'
import computeSurroundingTicks from '../../utils/computeSurroundingTicks'
// import { useAllV3TicksQuery } from 'state/data/enhanced'

// import ms from 'ms.macro'
import { useQuery } from '@apollo/client';
import { GET_TICKS, GET_BASE_POOL } from '../../GraphQL/index';
import { DEPLOYED } from '../../../../constants/index';

const {
  BasePool_Address
} = DEPLOYED;
const PRICE_FIXED_DIGITS = 8

// Tick with fields parsed to JSBIs, and active liquidity computed.
export interface TickProcessed {
  tickIdx: number
  liquidityActive: JSBI
  liquidityNet: JSBI
  price0: string
}

const getActiveTick = (tickCurrent: number | undefined, feeAmount: FeeAmount | undefined) =>
  tickCurrent && feeAmount ? Math.floor(tickCurrent / TICK_SPACINGS[feeAmount]) * TICK_SPACINGS[feeAmount] : undefined

// Fetches all ticks for a given pool
export function useAllV3Ticks(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmount | undefined
) {
  const poolAddress =
    currencyA && currencyB && feeAmount ? Pool.getAddress(currencyA?.wrapped, currencyB?.wrapped, feeAmount) : undefined
  //TODO(judo): determine if pagination is necessary for this query
  const { loading, error, data } = useQuery(GET_TICKS, {
    variables: {
      poolAddress: poolAddress?.toLowerCase(),
      skip: 0
    }
  })

  return {
    loading,
    error,
    ticks: data?.ticks as any,
  }
}

export function usePoolActiveLiquidity(
  currencyA: Currency | undefined, // 이런 자료형들 고려
  currencyB: Currency | undefined,
  feeAmount: FeeAmount | undefined
): {
  error: any
  activeTick: number | undefined
  data: TickProcessed[] | undefined
} {
  //TODO(jason): change BasePool to variables
  const pool = useQuery(GET_BASE_POOL, {
    variables: {address: BasePool_Address}
  })

  // console.log(pool[1]?.tickCurrent)
  // Find nearest valid tick for pool in case tick is not initialized.
  // graphql에서 pool의 tick 사용
  
  const activeTick = useMemo(() => getActiveTick(pool.data?.pools[0].tick, feeAmount), [pool, feeAmount])
  console.log(activeTick)

  const { loading, error, ticks } = useAllV3Ticks(currencyA, currencyB, feeAmount)
  console.log(ticks)
  return useMemo(() => {
    if (
      !currencyA ||
      !currencyB ||
      activeTick === undefined ||
      !ticks ||
      ticks.length === 0
    ) {
      return {
        error,
        activeTick,
        data: undefined,
      }
    }
  

    const token0 = currencyA?.wrapped
    const token1 = currencyB?.wrapped

    // find where the active tick would be to partition the array
    // if the active tick is initialized, the pivot will be an element
    // if not, take the previous tick as pivot
    const pivot = ticks.findIndex((tick: any) => tick.tickIdx > activeTick) - 1

    if (pivot < 0) {
      // consider setting a local error
      console.error('TickData pivot not found')
      return {
        error,
        activeTick,
        data: undefined,
      }
    }
    // 현재 activeTick을 확인
    const activeTickProcessed: TickProcessed = {
      liquidityActive: JSBI.BigInt(pool.data?.pools.liquidity ?? 0),
      tickIdx: activeTick,
      liquidityNet:
        Number(ticks[pivot].tickIdx) === activeTick ? JSBI.BigInt(ticks[pivot].liquidityNet) : JSBI.BigInt(0),
      price0: tickToPrice(token0, token1, activeTick).toFixed(PRICE_FIXED_DIGITS),
    }

    // activeTick 이후의 tick
    const subsequentTicks = computeSurroundingTicks(token0, token1, activeTickProcessed, ticks, pivot, true)
    // activeTick 이전의 tick
    const previousTicks = computeSurroundingTicks(token0, token1, activeTickProcessed, ticks, pivot, false)
    // previousTick + activeTick + subsequentTick
    const ticksProcessed = previousTicks.concat(activeTickProcessed).concat(subsequentTicks)

    return {
      loading,
      error,
      activeTick,
      data: ticksProcessed,
    }
  }, [currencyA, currencyB, activeTick, pool, ticks, error])
}
