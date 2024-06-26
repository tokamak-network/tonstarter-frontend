//MobileWtonTosLpReward
import {FC, useEffect, useState} from 'react';
import {Flex, Box, Text, useColorMode, useTheme} from '@chakra-ui/react';
import moment from 'moment';

type VaultTable = {
  claim: any;
};
type ClaimRound = {
  claimRound: number | string;
  claimTime: number | string;
  claimTokenAllocation: number;
};
type claimData = ClaimRound & {
  accumulated: number;
};
const middleStyle = {
    border: 'solid 1px #eff1f6',
  };

export const MobileVaultTable: FC<VaultTable> = ({claim}) => {
    const {colorMode} = useColorMode();
    const theme = useTheme();
    //   const vaultsList = publicTableData;
    const [tableData, setTableData] = useState<any>([]);
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
            claimRound: (index+1).toString(),
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
      }, [claim]);
      // console.log(tableData);

      
  return (
    <Box
    d="flex"
    textAlign="center"
    lineHeight={'42px'}
    flexDirection={'column'}
    mt={'20px'}>
    <Flex
      bg={colorMode === 'dark' ? '#222' : '#ffffff'}
    //   justifyContent={'space-between'}
      width={'100%'}>
      <Text
        height={'42px'}
        fontSize={11}
        w={'15%'}
        textAlign={'center'}
        fontWeight={'bold'}
        border={themeDesign.border[colorMode]}
        borderRight={'none'}>
        Round
      </Text>
      <Text
        height={'42px'}
        fontSize={11}
        w={'25%'}
        textAlign={'center'}
        fontWeight={'bold'}
        border={themeDesign.border[colorMode]}
        borderRight={'none'}>
        Date
      </Text>
      <Text
        height={'42px'}
        fontSize={11}
        w={'30%'}
        textAlign={'center'}
        fontWeight={'bold'}
        border={themeDesign.border[colorMode]}
        borderRight={'none'}>
        Allocation
      </Text>
      <Text
        // border={'solid 1px #373737'
        height={'42px'}
        fontSize={11}
        w={'30%'}
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
            fontSize={12}
            w={'15%'}
            textAlign={'center'}
            border={themeDesign.border[colorMode]}
            borderTop={'none'}
            borderRight={'none'}>
            {data.claimRound}
          </Text>
          <Text
            height={'42px'}
            fontSize={12}
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
            fontSize={12}
            w={'30%'}
            textAlign={'center'}
            border={themeDesign.border[colorMode]}
            borderTop={'none'}
            borderRight={'none'}>
            {Number(data.claimTokenAllocation).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}
          </Text>
          <Text
            height={'42px'}
            fontSize={12}
            w={'30%'}
            textAlign={'center'}
            border={themeDesign.border[colorMode]}
            borderTop={'none'}>
            {Number(data.accumulated).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}
          </Text>
        </Flex>
      );
    })}
  </Box>
  );
};
