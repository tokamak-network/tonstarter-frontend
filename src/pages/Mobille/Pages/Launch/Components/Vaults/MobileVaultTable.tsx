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
  <Flex>
    <Flex></Flex>
  </Flex>);
};
