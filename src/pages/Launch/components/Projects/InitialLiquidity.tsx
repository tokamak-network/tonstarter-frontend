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

type InitialLiquidity = {
  vault: any;
  project: any;
};

export const InitialLiquidity: FC<InitialLiquidity> = ({vault, project}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  console.log('Initial Liquidity vault: ', vault);

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
    <Grid templateColumns="repeat(2, 1fr)" w={'100%'}>
      <Flex flexDirection={'column'}>
        <GridItem
          className={'chart-cell no-border-right no-border-bottom'}
          fontSize={'16px'}>
          <Text>Token</Text>
          {/* Need to make TON changeable. */}
          <Text>
            {vault.vaultTokenAllocation} {project.tokenSymbol}
          </Text>
        </GridItem>
        <GridItem className={'chart-cell no-border-right no-border-bottom'}>
          <Text>Price Range</Text>
          {/* Need to make Full Range changeable. */}
          <Text>Full Range</Text>
        </GridItem>
        <GridItem className={'chart-cell no-border-right no-border-bottom'}>
          <Text>Selected Pair</Text>
          {/* Need to make Token Symbol - TOS changeable. */}
          <Text> {project.tokenSymbol} - TOS</Text>
        </GridItem>
        <GridItem className={'chart-cell no-border-right no-border-bottom'}>
          <Text>Pool Address</Text>
          {/* Need a valid poolAddress */}
          <Text>{shortenAddress(vault.vaultAddress)}</Text>
        </GridItem>
        <GridItem className={'chart-cell no-border-right no-border-bottom'}>
          <Text>Vault Admin</Text>
          <Text>{shortenAddress(vault.adminAddress)}</Text>
        </GridItem>
        <GridItem className={'chart-cell no-border-right'}>
          <Text>Vault Contract Address</Text>
          <Text>{shortenAddress(vault.vaultAddress)}</Text>{' '}
        </GridItem>
      </Flex>
      <Flex flexDirection={'column'}>
        <GridItem className={'chart-cell no-border-bottom'} fontSize={'16px'}>
          <Text>LP Token</Text>
          <Flex>
            <Text mr={'5px'}>ID</Text> <Text color={'#257eee'}>#562734</Text>
          </Flex>
        </GridItem>
        <GridItem className={'chart-cell no-border-bottom'}>
          <Text w={'25%'}>LP Token</Text>
          <Text w={'25%'} textAlign={'center'}>
            Project Token
          </Text>
          <Text w={'25%'} textAlign={'center'}>
            TOS
          </Text>
          <Text w={'25%'} textAlign={'center'}>
            Action
          </Text>
        </GridItem>
        <GridItem className={'chart-cell no-border-bottom'}>
          <Text>Increase Liquidity</Text>
          <Text>10,000,000</Text>
          <Text>10,000,000</Text>
          <Button
            w={'100px'}
            bg={'#257eee'}
            height={'32px'}
            padding={'9px 24px 8px'}
            borderRadius={'4px'}
            color={'#fff'}>
            Increase
          </Button>
        </GridItem>
        <GridItem className={'chart-cell no-border-bottom'}>
          <Text>Unclaimed Fees</Text>
          <Text>10,000,000</Text>
          <Text>10,000,000</Text>
          <Button
            w={'100px'}
            bg={'#257eee'}
            height={'32px'}
            padding={'9px 24px 8px'}
            borderRadius={'4px'}
            color={'#fff'}>
            Collect
          </Button>
        </GridItem>
        <GridItem className={'chart-cell no-border-bottom'}>
          <Text>{''}</Text>
        </GridItem>
        <GridItem className={'chart-cell'}>
          <Text>{''}</Text>
        </GridItem>
      </Flex>
    </Grid>
  );
};
