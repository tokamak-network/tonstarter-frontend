import React, {FC} from 'react';
import {useColorMode} from '@chakra-ui/react';
import {ResponsivePie} from '@nivo/pie';

type PieChartProps = {
  pieData: any;
};

export const PieChart: FC<PieChartProps> = ({pieData}) => {
  const {colorMode} = useColorMode();
  const colors = [
    '#8dd3c7',
    '#b3de69',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#ffffb3',
    '#fccde5',
    '#d9d9d9',
    '#bc80bd',
    '#ccebc5',
    '#ffed6f',
  ];
  const formattedData = pieData.vaults.map((data: any, index: number) => {
    return {
      id: data.vaultName,
      label: data.vaultName,
      value:
        data.vaultTokenAllocation === 0
          ? 0
          : (data.vaultTokenAllocation / pieData.totalTokenAllocation) * 100,
      color: colors[index],
    };
  });

  return (
    <ResponsivePie
      data={formattedData}
      padAngle={0.7}
      cornerRadius={0}
      margin={{bottom: 150, top: 10}}
      activeOuterRadiusOffset={3}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.2]],
      }}
      colors={{datum: 'data.color'}}
      tooltip={({datum: data}) => (
        <div
          style={{
            padding: 5,
            background: '#222222',
            color: '#fff',
            borderRadius: '3px',
          }}>
          <div style={{display: 'flex'}}>
            <p style={{marginRight: '5px'}}>{data.id}:</p>
            <p style={{color: data.color}}>
              {data.value.toString().slice(0, 4)}%
            </p>
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
          translateX: 25,
          translateY: 140,
          itemsSpacing: 0,
          itemWidth: 120,
          itemHeight: 18,
          itemTextColor: colorMode === 'dark' ? 'white' : 'black',
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 8,
          symbolShape: 'circle',
          data: formattedData
            .slice(0, Math.floor(formattedData.length / 2))
            .map((cur: any, index: number) => ({
              id: cur.id,
              label: `${cur.id} (${cur.value.toString().slice(0, 4)}%)`,
              color: cur.color,
            })),
        },
        {
          anchor: 'left',
          direction: 'column',
          justify: false,
          translateX: 180,
          translateY: 140,
          itemsSpacing: 0,
          itemWidth: 120,
          itemHeight: 18,
          itemTextColor: colorMode === 'dark' ? 'white' : 'black',
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 8,
          symbolShape: 'circle',
          data: formattedData
            .slice(Math.floor(formattedData.length / 2))
            .map((cur: any, index: number) => ({
              id: cur.id,
              label: `${cur.id} (${cur.value.toString().slice(0, 4)}%)`,
              color: cur.color,
            })),
        },
      ]}
    />
  );
};
