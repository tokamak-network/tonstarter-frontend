import React, { ReactNode, useCallback, useMemo } from 'react'
import { Currency, Price, Token } from '@uniswap/sdk-core'
import { BarChart2, Inbox, CloudOff } from 'react-feather'
import { AutoColumn, ColumnCenter } from '../Column'
import Loader from '../Loader'
// import { format } from 'd3'
import {format} from 'd3';
import {Bound} from './Bound';
import {Chart} from './Chart';
import {FeeAmount} from '@uniswap/v3-sdk';
import {saturate} from 'polished';
import {ZoomLevels} from './types';
// import { TYPE } from '../../theme'
import styled from 'styled-components/macro';
import {useDensityChartData} from './useDensityChartData';
import {batch} from 'react-redux';
import {useTheme, Flex, Heading, Text} from '@chakra-ui/react';

const ZOOM_LEVELS: Record<FeeAmount, ZoomLevels> = {
  [FeeAmount.LOW]: {
    initialMin: 0.999,
    initialMax: 1.001,
    min: 0.00001,
    max: 1.5,
  },
  [FeeAmount.MEDIUM]: {
    initialMin: 0.5,
    initialMax: 2,
    min: 0.00001,
    max: 20,
  },
  [FeeAmount.HIGH]: {
    initialMin: 0.5,
    initialMax: 2,
    min: 0.00001,
    max: 20,
  },
};

const ChartWrapper = styled.div`
  margin-top: 10px;
  position: relative;

  justify-content: center;
  align-content: center;
`;

function InfoBox({message, icon}: {message?: ReactNode; icon: ReactNode}) {
  return (
    <ColumnCenter style={{height: '100%', justifyContent: 'center'}}>
      {icon}
      {message && (
        <Heading padding={10} textAlign="center">
          {message}
        </Heading>
      )}
    </ColumnCenter>
  );
}

export default function LiquidityChartRangeInput({
  currencyA,
  currencyB,
  feeAmount,
  ticksAtLimit,
  price,
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  interactive,
}: {
  currencyA: Currency | undefined;
  currencyB: Currency | undefined;
  feeAmount?: FeeAmount;
  ticksAtLimit: {[bound in Bound]?: boolean | undefined};
  price: number | undefined;
  priceLower?: Price<Token, Token>;
  priceUpper?: Price<Token, Token>;
  onLeftRangeInput: (typedValue: string) => void;
  onRightRangeInput: (typedValue: string) => void;
  interactive: boolean;
}) {
  const isSorted = currencyA && currencyB && currencyA?.wrapped.sortsBefore(currencyB?.wrapped)
  const { isLoading, isUninitialized, isError, error, formattedData } = useDensityChartData({
    currencyA,
    currencyB,
    feeAmount,
  });
  const theme = useTheme();

  const onBrushDomainChangeEnded = useCallback(
    (domain, mode) => {
      // domain == price range
      let leftRangeValue = Number(domain[0]);
      const rightRangeValue = Number(domain[1]);

      if (leftRangeValue <= 0) {
        leftRangeValue = 1 / 10 ** 6;
      }

      batch(() => {
        // simulate user input for auto-formatting and other validations
        if (
          (!ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] ||
            mode === 'handle' ||
            mode === 'reset') &&
          leftRangeValue > 0
        ) {
          onLeftRangeInput(leftRangeValue.toFixed(6));
        }

        if (
          (!ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] ||
            mode === 'reset') &&
          rightRangeValue > 0
        ) {
          // todo: remove this check. Upper bound for large numbers
          // sometimes fails to parse to tick.
          if (rightRangeValue < 1e35) {
            onRightRangeInput(rightRangeValue.toFixed(6));
          }
        }
      });
    },
    [isSorted, onLeftRangeInput, onRightRangeInput, ticksAtLimit],
  );

  interactive = interactive && Boolean(formattedData?.length);

  const brushDomain: [number, number] | undefined = useMemo(() => {
    const leftPrice = isSorted ? priceLower : priceUpper?.invert();
    const rightPrice = isSorted ? priceUpper : priceLower?.invert();

    return leftPrice && rightPrice
      ? [
          parseFloat(leftPrice?.toSignificant(6)),
          parseFloat(rightPrice?.toSignificant(6)),
        ]
      : undefined;
  }, [isSorted, priceLower, priceUpper]);
  // console.log(brushDomain)
  // brush의 % 를 보여줌
  const brushLabelValue = useCallback(
    (d: 'w' | 'e', x: number) => {
      if (!price) return '';

      if (d === 'w' && ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER])
        return '0';
      if (d === 'e' && ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER])
        return '∞';

      const percent =
        (x < price ? -1 : 1) *
        ((Math.max(x, price) - Math.min(x, price)) / price) *
        100;

      return price
        ? `${format(Math.abs(percent) > 1 ? '.2~s' : '.2~f')(percent)}%`
        : '';
    },
    [isSorted, price, ticksAtLimit]
  )

  return (
    <AutoColumn gap="md" style={{ minHeight: '200px' }}>
      {isUninitialized ? (
        <InfoBox
          message={<Text>Your position will appear here.</Text>}
          icon={<Inbox size={56} stroke={theme.text1} />}
        />
      ) : isLoading ? (
        <InfoBox icon={<Loader size="40px" stroke={theme.text4} />} />
      ) : isError ? (
        <InfoBox
          message={<Text>Liquidity data not available.</Text>}
          icon={<CloudOff size={56} stroke={theme.text4} />}
        />
      ) : !formattedData || formattedData === [] || !price ? (
        <InfoBox
          message={<Text>There is no liquidity data.</Text>}
          icon={<BarChart2 size={56} stroke={theme.text4} />}
        />
      ) : (
        <ChartWrapper>
          <Chart
            data={{series: formattedData, current: price}}
            dimensions={{width: 400, height: 200}}
            margins={{top: 10, right: 2, bottom: 20, left: 0}}
            styles={{
              area: {
                selection: '#0068FC',
              },
              brush: {
                handle: {
                  west: saturate(0.1, '#2172E5') ?? theme.red1,
                  east: saturate(0.1, '#2172E5') ?? theme.blue1,
                },
              },
            }}
            interactive={interactive}
            brushLabels={brushLabelValue}
            brushDomain={brushDomain}
            onBrushDomainChange={onBrushDomainChangeEnded}
            zoomLevels={ZOOM_LEVELS[feeAmount ?? FeeAmount.MEDIUM]}
            ticksAtLimit={ticksAtLimit}
          />
        </ChartWrapper>
      )}
    </AutoColumn>
  );
}
