import {Box, Flex, Text, useColorMode, useTheme} from '@chakra-ui/react';
import {Projects, VaultAny} from '@Launch/types';
import {useEffect, useState} from 'react';
import commafy from 'utils/commafy';
import {publicTableData} from '../FakeData';

const middleStyle = {
  border: 'solid 1px #eff1f6',
};

export const PublicPageTable = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {OpenCampaginDesign} = theme;
  //   const vaultsList = publicTableData;
  const [tableData, setTableData] = useState<any>(publicTableData);
  const [totalAllocation, setTotalAllocation] = useState<number>(0);

  useEffect(() => {
    let total = 0;
    tableData.forEach((data: any) => {
      total += data.allocation;
    });
    const roundedTotal = Math.round(total * 100) / 100;
    setTotalAllocation(roundedTotal);
  }, []);

  return (
    <Box
      d="flex"
      textAlign="center"
      lineHeight={'42px'}
      flexDirection={'column'}>
      <Flex bg={'#222'} justifyContent={'space-between'} width={'100%'}>
        <Text
          borderTop={middleStyle.border}
          // border={'solid 1px #373737'
          height={'42px'}
          fontSize={13}
          w={'25%'}
          textAlign={'center'}
          fontWeight={'bold'}
          border={'solid 1px #373737'}>
          Round
        </Text>
        <Text
          borderTop={middleStyle.border}
          // border={'solid 1px #373737'
          height={'42px'}
          fontSize={13}
          w={'25%'}
          textAlign={'center'}
          fontWeight={'bold'}
          border={'solid 1px #373737'}>
          Date
        </Text>
        <Text
          borderTop={middleStyle.border}
          // border={'solid 1px #373737'
          height={'42px'}
          fontSize={13}
          w={'25%'}
          textAlign={'center'}
          fontWeight={'bold'}
          border={'solid 1px #373737'}>
          Allocation
        </Text>
        <Text
          borderTop={middleStyle.border}
          // border={'solid 1px #373737'
          height={'42px'}
          fontSize={13}
          w={'25%'}
          textAlign={'center'}
          fontWeight={'bold'}
          border={'solid 1px #373737'}>
          Accumulated
        </Text>
      </Flex>
      {tableData.map((data: any, index: number) => {
        return (
          <Flex
            bg={index % 2 === 0 ? '#262626' : '#222'}
            justifyContent={'space-between'}
            width={'100%'}>
            <Text
              borderTop={middleStyle.border}
              // border={'solid 1px #373737'}
              height={'42px'}
              fontSize={13}
              w={'25%'}
              textAlign={'center'}
              border={'solid 1px #373737'}>
              {data.round}
            </Text>
            <Text
              borderTop={middleStyle.border}
              // border={'solid 1px #373737'}
              height={'42px'}
              fontSize={13}
              w={'25%'}
              textAlign={'center'}
              border={'solid 1px #373737'}>
              {data.date}
            </Text>
            <Text
              borderTop={middleStyle.border}
              // border={'solid 1px #373737'}
              height={'42px'}
              fontSize={13}
              w={'25%'}
              textAlign={'center'}
              border={'solid 1px #373737'}>
              {data.allocation}
            </Text>
            <Text
              borderTop={middleStyle.border}
              // border={'solid 1px #373737'}
              height={'42px'}
              fontSize={13}
              w={'25%'}
              textAlign={'center'}
              border={'solid 1px #373737'}>
              {data.accumulated}
            </Text>
          </Flex>
        );
      })}
      <Flex bg={'#222'} justifyContent={'space-between'} width={'100%'}>
        <Text
          borderTop={middleStyle.border}
          // border={'solid 1px #373737'
          height={'42px'}
          fontSize={13}
          w={'25%'}
          textAlign={'center'}
          fontWeight={'bold'}
          border={'solid 1px #373737'}>
          SUM
        </Text>
        <Text
          borderTop={middleStyle.border}
          // border={'solid 1px #373737'
          height={'42px'}
          fontSize={13}
          w={'25%'}
          textAlign={'center'}
          fontWeight={'bold'}
          border={'solid 1px #373737'}>
          -
        </Text>
        <Text
          borderTop={middleStyle.border}
          // border={'solid 1px #373737'
          height={'42px'}
          fontSize={13}
          w={'25%'}
          textAlign={'center'}
          fontWeight={'bold'}
          border={'solid 1px #373737'}>
          {totalAllocation}
        </Text>
        <Text
          borderTop={middleStyle.border}
          // border={'solid 1px #373737'
          height={'42px'}
          fontSize={13}
          w={'25%'}
          textAlign={'center'}
          fontWeight={'bold'}
          border={'solid 1px #373737'}>
          -
        </Text>
      </Flex>
    </Box>
  );
};
