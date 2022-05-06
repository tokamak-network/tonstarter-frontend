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
import commafy from 'utils/commafy';
type InitialLiquidity = {
  vault: any;
  project: any;
};

export const InitialLiquidity: FC<InitialLiquidity> = ({vault, project}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  // console.log('Initial Liquidity vault: ', vault);

  const themeDesign = {
    border: {
      light: 'solid 1px #e6eaee',
      dark: 'solid 1px #373737',
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
          border={themeDesign.border[colorMode]}
          borderRight={'none'}
          borderBottom={'none'}
          className={'chart-cell no-border-right no-border-bottom'}
          fontSize={'16px'}>
          <Text fontFamily={theme.fonts.fld}>Token</Text>
          {/* Need to make TON changeable. */}
          <Text fontFamily={theme.fonts.fld}>
            {commafy(Number(vault.vaultTokenAllocation))} {project.tokenSymbol}
          </Text>
        </GridItem>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderRight={'none'}
          borderBottom={'none'}
          className={'chart-cell no-border-right no-border-bottom'}>
          <Text fontFamily={theme.fonts.fld}>Price Range</Text>
          {/* Need to make Full Range changeable. */}
          <Text fontFamily={theme.fonts.fld}>Full Range</Text>
        </GridItem>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderRight={'none'}
          borderBottom={'none'}
          className={'chart-cell no-border-right no-border-bottom'}>
          <Text fontFamily={theme.fonts.fld}>Selected Pair</Text>
          {/* Need to make Token Symbol - TOS changeable. */}
          <Text fontFamily={theme.fonts.fld}> {project.tokenSymbol} - TOS</Text>
        </GridItem>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderRight={'none'}
          borderBottom={'none'}
          className={'chart-cell no-border-right no-border-bottom'}>
          <Text fontFamily={theme.fonts.fld}>Pool Address</Text>
          {/* Need a valid poolAddress */}
          <Text fontFamily={theme.fonts.fld}>
            {shortenAddress(vault.vaultAddress)}
          </Text>
        </GridItem>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderRight={'none'}
          borderBottom={'none'}
          className={'chart-cell no-border-right no-border-bottom'}>
          <Text fontFamily={theme.fonts.fld}>Vault Admin</Text>
          <Text fontFamily={theme.fonts.fld}>
            {shortenAddress(vault.adminAddress)}
          </Text>
        </GridItem>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderRight={'none'}
          className={'chart-cell no-border-right'}>
          <Text fontFamily={theme.fonts.fld}>Vault Contract Address</Text>
          <Text fontFamily={theme.fonts.fld}>
            {shortenAddress(vault.vaultAddress)}
          </Text>{' '}
        </GridItem>
      </Flex>
      <Flex flexDirection={'column'}>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderBottom={'none'}
          className={'chart-cell no-border-bottom'}
          fontSize={'16px'}>
          <Text fontFamily={theme.fonts.fld}>LP Token</Text>
          <Flex>
            <Text fontFamily={theme.fonts.fld} mr={'5px'}>
              ID
            </Text>{' '}
            <Text fontFamily={theme.fonts.fld} color={'#257eee'}>
              #562734
            </Text>
          </Flex>
        </GridItem>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderBottom={'none'}
          className={'chart-cell no-border-bottom'}>
          <Text fontFamily={theme.fonts.fld} w={'25%'} color={'#7e8993'}>
            LP Token
          </Text>
          <Text
            fontFamily={theme.fonts.fld}
            w={'25%'}
            color={'#7e8993'}
            textAlign={'center'}>
            Project Token
          </Text>
          <Text
            fontFamily={theme.fonts.fld}
            w={'25%'}
            color={'#7e8993'}
            textAlign={'center'}>
            TOS
          </Text>
          <Text
            fontFamily={theme.fonts.fld}
            w={'25%'}
            color={'#7e8993'}
            textAlign={'center'}>
            Action
          </Text>
        </GridItem>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderBottom={'none'}
          className={'chart-cell no-border-bottom'}>
          <Text fontFamily={theme.fonts.fld}>Increase Liquidity</Text>
          <Text fontFamily={theme.fonts.fld}>10,000,000</Text>
          <Text fontFamily={theme.fonts.fld}>10,000,000</Text>
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
        <GridItem
          border={themeDesign.border[colorMode]}
          borderBottom={'none'}
          className={'chart-cell no-border-bottom'}>
          <Text fontFamily={theme.fonts.fld}>Unclaimed Fees</Text>
          <Text fontFamily={theme.fonts.fld}>10,000,000</Text>
          <Text fontFamily={theme.fonts.fld}>10,000,000</Text>
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
        <GridItem
          border={themeDesign.border[colorMode]}
          borderBottom={'none'}
          className={'chart-cell no-border-bottom'}>
          <Text fontFamily={theme.fonts.fld}>{''}</Text>
        </GridItem>
        <GridItem
          border={themeDesign.border[colorMode]}
          className={'chart-cell'}>
          <Text fontFamily={theme.fonts.fld}>{''}</Text>
        </GridItem>
      </Flex>
    </Grid>
  );
};
