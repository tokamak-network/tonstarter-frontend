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

import {shortenAddress} from 'utils/address';

type WtonTosLpReward = {vault: any; project: any};

export const WtonTosLpReward: FC<WtonTosLpReward> = ({vault, project}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

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
        <Flex flexDirection={'column'} w={'60%'}>
          <GridItem
            className={'chart-cell no-border-right no-border-bottom'}
            fontSize={'16px'}>
            <Text>Token</Text>
            <Text>
              {vault.vaultTokenAllocation} {project.tokenSymbol}
            </Text>
          </GridItem>
          <GridItem className={'chart-cell no-border-right no-border-bottom'}>
            <Text>Selected Pair</Text>
            <Text> {project.tokenSymbol} - TOS</Text>
          </GridItem>
          <GridItem className={'chart-cell no-border-right no-border-bottom'}>
            <Text>Pool Address</Text>
            <Text>
              {vault.poolAddress ? shortenAddress(vault.poolAddress) : 'N/A'}
            </Text>
          </GridItem>
          <GridItem className={'chart-cell no-border-right no-border-bottom'}>
            <Text>Vault Admin</Text>
            <Text>
              {vault.adminAddress ? shortenAddress(vault.adminAddress) : 'N/A'}
            </Text>
          </GridItem>
          <GridItem className={'chart-cell no-border-right'}>
            <Text>Vault Contract Address</Text>
            <Text>
              {vault.vaultAddress ? shortenAddress(vault.vaultAddress) : 'N/A'}
            </Text>
          </GridItem>
        </Flex>
        <Flex flexDirection={'column'} ml={'-40%'}>
          <GridItem className={'chart-cell no-border-bottom'}>
            <Text w={'40%'}>Liquidity Rewards Program Listed</Text>
            <Flex w={'60%'} alignItems={'center'} justifyContent={'flex-end'}>
              <Flex flexDirection={'column'} mr={'20px'} textAlign={'right'}>
                <Text>You can create rewards program on</Text>
                <Text>Mar. 31, 2022 00:00:00 (KST)</Text>
              </Flex>
              <Button
                bg={'#257eee'}
                fontSize={'12px'}
                height={'40px'}
                width={'120px'}
                padding={'6px 12px'}
                whiteSpace={'normal'}
                color={'#fff'}>
                Create Reward Program
              </Button>
            </Flex>
          </GridItem>
          <GridItem className={'chart-cell no-border-bottom'}>
            <Text w={'15%'}>#10</Text>
            <Flex w={'40%'} flexDirection={'column'} mr={'50px'}>
              <Text>Reward Duration</Text>
              <Text>2021.03.09 13:25 - 2022.03.09 13:26</Text>
            </Flex>
            <Flex w={'25%'} flexDirection={'column'} mr={'20px'}>
              <Text>Refundable Amount</Text>
              <Text>10,000,000 TON</Text>
            </Flex>
            <Button
              bg={'#257eee'}
              fontSize={'12px'}
              padding={'6px 41px 5px'}
              height={'25px'}
              borderRadius={'4px'}
              width={'120px'}
              color={'#fff'}>
              Refund
            </Button>
          </GridItem>
          <GridItem
            className={'chart-cell no-border-bottom'}
            justifyContent={'flex-start'}>
            <Text w={'15%'}>#10</Text>
            <Flex flexDirection={'column'}>
              <Text>Reward Duration</Text>
              <Text>2021.03.09 13:25 - 2022.03.09 13:26</Text>
            </Flex>
          </GridItem>
          <GridItem
            className={'chart-cell no-border-bottom'}
            justifyContent={'flex-start'}>
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
      {/* <PublicPageTable /> */}
    </>
  );
};
