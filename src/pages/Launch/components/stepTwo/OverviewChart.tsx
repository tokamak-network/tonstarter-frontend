import {Box, Flex, Text, useColorMode, useTheme} from '@chakra-ui/react';
import {Projects, VaultAny} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useEffect, useState} from 'react';
import {ResponsiveLine} from '@nivo/line';
import Vaults from './Vaults';
const OverviewChart = () => {
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const [dataUndefined, setDataUndefined] = useState<boolean>(true)
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

  
  const formattedData = values.vaults.map ((data:any, index:any) => {
      // console.log(index);
      return {
          id: data.vaultName,
          color: colors[index],
          data: data.claim.map((claims:any, index: any) => {
              return {
                  'x': index+1,
                  'y': claims.claimTokenAllocation === undefined? 0: claims.claimTokenAllocation
              }
          })
      }
  })

  return (
    <Flex height={'450px'}>
    
      <ResponsiveLine
        data={formattedData}
        margin={{top: 50, right: 50, bottom: 50, left: 80}}
        xScale={{type: 'point'}}
        yScale={{
          type: 'linear',
        //   min: 'auto',
        //   max: 'auto',
        //   stacked: true,
          reverse: false,
        }}
        // yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Round',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
          colors={{ "scheme":"set3" }}
        axisLeft={{
           
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Token Allocation',
            legendOffset: -60,
            legendPosition: 'middle'
        }}
        pointSize={1}
        pointColor={{ from:"color"}}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'top',
                direction: 'row',
                justify: false,
                translateX: 20,
                translateY: -40,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 150,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                
            }
        ]}
      />
    </Flex>
  );
};

export default OverviewChart;
