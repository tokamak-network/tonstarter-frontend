import {Flex, useColorMode, useTheme,Text} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {ResponsivePie} from '@nivo/pie';


const GraphComponent = () => {
    const {colorMode} = useColorMode();
    const theme = useTheme();
    const colors = [
        '#1b3c6b',
        '#2b66aa',
        '#5da344',
        '#f7b729',
        '#80b1d3',
        '#fdb462',
        '#ffffb3',
        '#fccde5',
        '#d9d9d9',
        '#bc80bd',
        '#ccebc5',
        '#ffed6f',
      ];
    
      const data = [
        {
          "id": "public",
          "label": "Public",
          "value": 0.3,
         
        },
        {
          "id": "ecosystem",
          "label": "Ecosystem",
          "value": 0.35,
       
        },
        {
          "id": "team",
          "label": "Team",
          "value": 0.15,
          
        },
        {
          "id": "liquidity",
          "label": "Liquidity",
          "value": 0.15,
        
        },
        {
          "id": "tonstarter",
          "label": "TONStarter",
          "value": 0.05,
         
        }
      ]
      const formattedData = data.map((data: any, index: number) => {
        return {
          id: data.id,
          label: data.label,
          value: data.value,
          color: colors[index],
        };
      });


    return (
        <Flex mt='40px' w='100%' alignItems='center' flexDir={'column'}>
            <Text fontSize={'16px'} mb='30px' color={colorMode==='dark'?'white.100':'gray.375'}>Token Distribution</Text>
<ResponsivePie
      data={formattedData}
      padAngle={0.7}
      cornerRadius={0}
      
      margin={{bottom: 84}}
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
            <p style={{marginRight: '5px'}}>{data.label}:</p>
            <p style={{color: data.color}}>
              {data.value*100}%
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
          translateX: 81,
          translateY: 148,
          itemsSpacing: 0,
          itemWidth: 123,
          itemHeight: 16,
          itemTextColor: colorMode === 'dark' ? 'white' : 'black',
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 8,
          symbolShape: 'circle',
          data: formattedData
            .slice(0, Math.floor(formattedData.length / 2))
            .map((cur: any, index: number) => ({
              id: cur.id,
              label: `${cur.label} (${cur.value*100}%)`,
              color: cur.color,
            })),
        },
        {
          anchor: 'left',
          direction: 'column',
          justify: false,
          translateX: 234,
          translateY: 148,
          itemsSpacing: 0,
          itemWidth: 123,
          itemHeight: 16,
          itemTextColor: colorMode === 'dark' ? 'white' : 'black',
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 8,
          symbolShape: 'circle',
          data: formattedData
            .slice(Math.floor(formattedData.length / 2))
            .map((cur: any, index: number) => ({
              id: cur.id,
              label: `${cur.label} (${cur.value*100}%)`,
              color: cur.color,
            })),
        },
      ]}
    />
        </Flex>
    )
}

export default GraphComponent