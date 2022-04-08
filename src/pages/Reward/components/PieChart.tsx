import React, {FC, useState, useEffect} from 'react';
import {useColorMode} from '@chakra-ui/react';
import {ResponsivePie} from '@nivo/pie';
import {shortenAddress} from 'utils';

type PieChartProps = {
  pieData: any;
};

export const PieChart: FC<PieChartProps> = ({pieData}) => {
  const {colorMode} = useColorMode();

  const formattedData = pieData.map((data: any) => {
    return {
      id: shortenAddress(data.ownerAddress),
      label: `${shortenAddress(data.ownerAddress)} ${Number(
        data.liquidityPercentage,
      )}%`,
      value: Number(data.liquidityPercentage),
      tokensOwned: data.tokensOwned,
      // color: `hsl(${Math.floor(Math.random() * (360 - 0 + 1) + 0)}, 70%, 50%)`,
    };
  });

  return (
    // make sure parent container have a defined height when using
    // responsive component, otherwise height will be 0 and
    // no chart will be rendered.
    // website examples showcase many properties,
    // you'll often use just a few of them.
    <ResponsivePie
      data={formattedData}
      padAngle={0.7}
      cornerRadius={3}
      margin={{top: 3, bottom: 3}}
      // This field will allow the pie slices to grow outside the circle.
      activeOuterRadiusOffset={3}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.2]],
      }}
      // there are color scheme options using the nivo pie example. If you want custom colors add {{ datum: 'data.color' }} ~~ data.color will reference the formattedData object above.
      colors={{
        scheme: 'category10',
      }}
      tooltip={({datum: data}) => (
        <div
          style={{
            padding: 5,
            background: '#222222',
            color: '#fff',
          }}>
          <div style={{display: 'flex'}}>
            <p style={{marginRight: '5px'}}>{data.id}:</p>
            <p style={{color: data.color}}>{data.value}%</p>
          </div>
          <div>
            <p>Token IDs Staked:</p>
            {/*@ts-ignore*/}
            {data?.data?.tokensOwned?.map((token: any) => {
              return <p>{token}</p>;
            })}
          </div>
        </div>
      )}
      enableArcLinkLabels={false}
      enableArcLabels={false}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{from: 'color'}}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [['darker', 2]],
      }}
      theme={{
        tooltip: {
          container: {
            color: 'white',
            background: 'black',
          },
        },
      }}
      legends={[
        {
          anchor: 'left',
          direction: 'column',
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: colorMode === 'dark' ? 'white' : 'black',
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 10,
          symbolShape: 'circle',
          // effects: [
          //   {
          //     on: 'hover',
          //     style: {
          //       itemTextColor: '#000',
          //     },
          //   },
          // ],
        },
      ]}
    />
  );
};
