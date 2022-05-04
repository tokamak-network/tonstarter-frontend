import {Box, Flex, Text, useColorMode, useTheme} from '@chakra-ui/react';
import {Projects, VaultAny} from '@Launch/types';
import {useEffect, useState} from 'react';
import commafy from 'utils/commafy';
import {publicTableData} from '../FakeData';
import moment from 'moment';
const middleStyle = {
  border: 'solid 1px #eff1f6',
};
type ClaimRound = {
  claimRound: number | string;
  claimTime: number | string;
  claimTokenAllocation: number;
};
type claimData = ClaimRound & {
  accumulated: number;
};
type PublicTableProps = {
  claim: ClaimRound[];
};
export const PublicPageTable = (prop: PublicTableProps) => {
  const {claim} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  //   const vaultsList = publicTableData;
  const [tableData, setTableData] = useState<any>(publicTableData);
  const [totalAllocation, setTotalAllocation] = useState<number>(0);

  const themeDesign = {
    border: {
      light: 'solid 1px #e7edf3',
      dark: 'solid 1px #535353',
    },
    font: {
      light: 'black.300',
      dark: 'gray.475',
    },
    tosFont: {
      light: 'gray.250',
      dark: 'black.100',
    },
    borderDashed: {
      light: 'dashed 1px #dfe4ee',
      dark: 'dashed 1px #535353',
    },
    buttonColorActive: {
      light: 'gray.225',
      dark: 'gray.0',
    },
    buttonColorInactive: {
      light: '#c9d1d8',
      dark: '#777777',
    },
  };

  useEffect(() => {
    let total = 0;
    claim.forEach((data: any) => {
      total += data.claimTokenAllocation;
    });
    const roundedTotal = Math.round(total * 100) / 100;
    setTotalAllocation(roundedTotal);
    const claimData = claim.map((claimRound: any, index: number) => {
      return {
        claimRound: claimRound.claimRound,
        claimTime: claimRound.claimTime,
        claimTokenAllocation: claimRound.claimTokenAllocation,
        accumulated: claimRound.claimTokenAllocation,
      };
    });
    claimData.map((round: any, i: number) => {
      round.accumulated =
        i === 0
          ? round.claimTokenAllocation
          : claimData[i - 1].accumulated + round.claimTokenAllocation;
    });
    claimData.push({
      claimRound: 'SUM',
      claimTime: '-',
      claimTokenAllocation: roundedTotal,
      accumulated: claimData[claimData.length - 1].accumulated,
    });
    setTableData(claimData);
  }, []);
  // console.log(tableData);

  return (
    <Box
      d="flex"
      textAlign="center"
      lineHeight={'42px'}
      flexDirection={'column'}>
      <Flex
        bg={colorMode === 'dark' ? '#222' : '#ffffff'}
        justifyContent={'space-between'}
        width={'100%'}>
        <Text
          height={'42px'}
          fontSize={13}
          w={'25%'}
          textAlign={'center'}
          fontWeight={'bold'}
          border={themeDesign.border[colorMode]}
          borderRight={'none'}>
          Round
        </Text>
        <Text
          height={'42px'}
          fontSize={13}
          w={'25%'}
          textAlign={'center'}
          fontWeight={'bold'}
          border={themeDesign.border[colorMode]}
          borderRight={'none'}>
          Date
        </Text>
        <Text
          height={'42px'}
          fontSize={13}
          w={'25%'}
          textAlign={'center'}
          fontWeight={'bold'}
          border={themeDesign.border[colorMode]}
          borderRight={'none'}>
          Allocation
        </Text>
        <Text
          // border={'solid 1px #373737'
          height={'42px'}
          fontSize={13}
          w={'25%'}
          textAlign={'center'}
          fontWeight={'bold'}
          border={themeDesign.border[colorMode]}>
          Accumulated
        </Text>
      </Flex>
      {tableData.map((data: any, index: number) => {
        return (
          <Flex
            bg={
              index % 2 === 0
                ? colorMode === 'dark'
                  ? '#262626'
                  : '#fafbfc'
                : colorMode === 'dark'
                ? '#222'
                : '#fff'
            }
            justifyContent={'space-between'}
            width={'100%'}>
            <Text
              height={'42px'}
              fontSize={13}
              w={'25%'}
              textAlign={'center'}
              border={themeDesign.border[colorMode]}
              borderTop={'none'}
              borderRight={'none'}>
              {data.claimRound}
            </Text>
            <Text
              height={'42px'}
              fontSize={13}
              w={'25%'}
              textAlign={'center'}
              border={themeDesign.border[colorMode]}
              borderTop={'none'}
              borderRight={'none'}>
              {data.claimTime === '-'
                ? '-'
                : moment.unix(data.claimTime).format('YYYY.MM.DD HH:mm:ss')}
            </Text>
            <Text
              height={'42px'}
              fontSize={13}
              w={'25%'}
              textAlign={'center'}
              border={themeDesign.border[colorMode]}
              borderTop={'none'}
              borderRight={'none'}>
              {commafy(data.claimTokenAllocation)}
            </Text>
            <Text
              height={'42px'}
              fontSize={13}
              w={'25%'}
              textAlign={'center'}
              border={themeDesign.border[colorMode]}
              borderTop={'none'}>
              {commafy(data.accumulated)}
            </Text>
          </Flex>
        );
      })}
    </Box>
  );
};
