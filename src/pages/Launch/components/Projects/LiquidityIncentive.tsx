import {FC} from 'react';
import {
  Flex,
  Text,
  Grid,
  GridItem,
  useTheme,
  useColorMode,
  Button,
} from '@chakra-ui/react';
import {PublicPageTable} from './PublicPageTable';

import {shortenAddress} from 'utils/address';

type LiquidityIncentive = {vault: any; project: any};

export const LiquidityIncentive: FC<LiquidityIncentive> = ({
  vault,
  project,
}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  console.log('vault: ', vault);

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

  return (
    <>
      <Grid templateColumns="repeat(2, 1fr)" w={'100%'} mb={'30px'}>
        <Flex flexDirection={'column'} w={'70%'}>
          <GridItem className={'chart-cell'} fontSize={'16px'}>
            <Text>Token</Text>
            <Text>
              {vault.vaultTokenAllocation} {project.tokenSymbol}
            </Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>Selected Pair</Text>
            <Text> {project.tokenSymbol} - TOS</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>Pool Address</Text>
            <Text>{vault.poolAddress || 'N/A'}</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>Vault Admin</Text>
            <Text>{vault.adminAddress || 'N/A'}</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>Vault Contract Address</Text>
            <Text>{vault.vaultAddress || 'N/A'}</Text>{' '}
          </GridItem>
        </Flex>
        <Flex flexDirection={'column'} ml={'-30%'}>
          <GridItem className={'chart-cell'}>
            <Text w={'25%'}>Liquidity Rewards Program Listed</Text>
            <Flex w={'35%'} flexDirection={'column'} mr={'50px'}>
              <Text>You can create rewards program on</Text>
              <Text>Mar. 31, 2022 00:00:00 (KST)</Text>
            </Flex>
            <Button>Create</Button>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text w={'15%'}>#10</Text>
            <Flex w={'40%'} flexDirection={'column'} mr={'50px'}>
              <Text>Reward Duration</Text>
              <Text>2021.03.09 13:25 - 2022.03.09 13:26</Text>
            </Flex>
            <Flex w={'25%'} flexDirection={'column'} mr={'25px'}>
              <Text>Refundable Amount</Text>
              <Text>10,000,000 TON</Text>
            </Flex>
            <Button>Refund</Button>
          </GridItem>
          <GridItem className={'chart-cell'} justifyContent={'flex-start'}>
            <Text w={'15%'}>#10</Text>
            <Flex flexDirection={'column'}>
              <Text>Reward Duration</Text>
              <Text>2021.03.09 13:25 - 2022.03.09 13:26</Text>
            </Flex>
          </GridItem>
          <GridItem className={'chart-cell'} justifyContent={'flex-start'}>
            <Text w={'15%'}>#10</Text>
            <Flex flexDirection={'column'}>
              <Text>Reward Duration</Text>
              <Text>2021.03.09 13:25 - 2022.03.09 13:26</Text>
            </Flex>
          </GridItem>
          <GridItem className={'chart-cell'} justifyContent={'center'}>
            <Text>Pagination...</Text>
          </GridItem>
        </Flex>
      </Grid>
      <PublicPageTable />
    </>
  );
};
