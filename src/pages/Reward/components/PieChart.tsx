import React, {FC, useState, useEffect} from 'react';
import {ResponsivePie} from '@nivo/pie';

type PieChartProps = {
  pieData: any;
};

export const PieChart: FC<PieChartProps> = ({pieData}) => {
  console.log('pieData: ', pieData);
  const formattedData = pieData.map((data: any) => {
    return {
      id: data.token,
      label: data.token,
      // label: data.owner,
      value: Math.floor(Math.random() * (360 - 30 + 1) + 30),
      color: `hsl(${Math.floor(Math.random() * (360 - 0 + 1) + 0)}, 70%, 50%)`,
    };
  });
  console.log('formattedData: ', formattedData);
  const pieDataTest = [
    {
      id: 'c',
      label: 'c',
      value: 20,
      color: 'hsl(298, 70%, 50%)',
    },
    {
      id: 'javascript',
      label: 'javascript',
      value: 129,
      color: 'hsl(217, 70%, 50%)',
    },
    {
      id: 'elixir',
      label: 'elixir',
      value: 507,
      color: 'hsl(348, 70%, 50%)',
    },
    {
      id: 'css',
      label: 'css',
      value: 574,
      color: 'hsl(79, 70%, 50%)',
    },
    {
      id: 'stylus',
      label: 'stylus',
      value: 123,
      color: 'hsl(275, 70%, 50%)',
    },
    {
      id: 'd',
      label: 'stylus',
      value: 222,
      color: 'hsl(275, 70%, 50%)',
    },
    {
      id: 'b',
      label: 'stylus',
      value: 111,
      color: 'hsl(275, 70%, 50%)',
    },
    {
      id: 'a',
      label: 'stylus',
      value: 53,
      color: 'hsl(275, 70%, 50%)',
    },
  ];

  return (
    // make sure parent container have a defined height when using
    // responsive component, otherwise height will be 0 and
    // no chart will be rendered.
    // website examples showcase many properties,
    // you'll often use just a few of them.

    <ResponsivePie
      data={formattedData}
      // margin={{top: 40, right: 80, bottom: 80, left: 80}}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.2]],
      }}
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
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: 'rgba(255, 255, 255, 0.3)',
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: 'rgba(255, 255, 255, 0.3)',
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: 'ruby',
          },
          id: 'dots',
        },
        {
          match: {
            id: 'c',
          },
          id: 'dots',
        },
        {
          match: {
            id: 'go',
          },
          id: 'dots',
        },
        {
          match: {
            id: 'python',
          },
          id: 'dots',
        },
        {
          match: {
            id: 'scala',
          },
          id: 'lines',
        },
        {
          match: {
            id: 'lisp',
          },
          id: 'lines',
        },
        {
          match: {
            id: 'elixir',
          },
          id: 'lines',
        },
        {
          match: {
            id: 'javascript',
          },
          id: 'lines',
        },
      ]}
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
          itemTextColor: '#999',
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 18,
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
