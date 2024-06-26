import React, { useMemo } from 'react'
import { area, curveStepAfter, ScaleLinear } from 'd3'
import styled from 'styled-components/macro'
import { ChartEntry } from './types'
import inRange from 'lodash/inRange'

const Path = styled.path<{ fill: string | undefined }>`
  opacity: 0.5;
  stroke: ${({ fill, theme }) => fill ?? theme.blue2};
  fill: ${({ fill, theme }) => fill ?? theme.blue2};
`

export const Area = ({
  series,
  xScale,
  yScale,
  xValue,
  yValue,
  fill,
}: {
  series: ChartEntry[]
  xScale: ScaleLinear<number, number>
  yScale: ScaleLinear<number, number>
  xValue: (d: ChartEntry) => number
  yValue: (d: ChartEntry) => number
  fill?: string | undefined
}) =>
  useMemo(
    () => (
      <Path
        fill={fill}
        d={
          area()
            .curve(curveStepAfter)
            .x((d: unknown) => xScale(xValue(d as ChartEntry)))
            .y1((d: unknown) => yScale(yValue(d as ChartEntry)))
            .y0(yScale(0))(
            series.filter((d) => inRange(xScale(xValue(d)), 0, window.innerWidth)) as Iterable<[number, number]>
          ) ?? undefined
        }
      />
    ),
    [fill, series, xScale, xValue, yScale, yValue]
  )
