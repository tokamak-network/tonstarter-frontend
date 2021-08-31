import { useCallback, useMemo } from 'react'
import { Currency } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import { usePoolActiveLiquidity } from './usePoolTickData'
import { ChartEntry } from './types'
import JSBI from 'jsbi'


export interface TickProcessed {
  liquidityActive: JSBI
  price0: string
}

export function useDensityChartData({
  currencyA,
  currencyB,
  feeAmount,
}: {
  currencyA: Currency | undefined
  currencyB: Currency | undefined
  feeAmount: FeeAmount | undefined
}) {
  const { error, data } = usePoolActiveLiquidity(currencyA, currencyB, feeAmount)
  const formatData = useCallback(() => {
    if (!data?.length) {
      return undefined
    }

    const newData: ChartEntry[] = []
    console.log(data)
    for (let i = 0; i < data.length; i++) {
      const t: TickProcessed = data[i]
      console.log(parseFloat(t.liquidityActive.toString()))

      const chartEntry = {
        activeLiquidity: parseFloat(t.liquidityActive.toString()),
        price0: parseFloat(t.price0),
      }

      if (chartEntry.activeLiquidity > 0) {
        newData.push(chartEntry)
      }
    }

    return newData
  }, [data])
  console.log(formatData())

  return useMemo(() => {
    return {
      error,
      formattedData: formatData(),
    }
  }, [error, formatData])
}
