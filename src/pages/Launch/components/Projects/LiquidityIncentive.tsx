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
import commafy from 'utils/commafy';

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
    <>
      <Grid templateColumns="repeat(2, 1fr)" w={'100%'} mb={'30px'}>
        <Flex flexDirection={'column'} w={'60%'}>
          <GridItem
            fontFamily={theme.fonts.fld}
            className={'chart-cell'}
            fontSize={'16px'}
            border={themeDesign.border[colorMode]}
            borderRight={'none'}
            borderBottom={'none'}
            color={colorMode === 'light' ? '#353c48' : '#fff'}>
            <Text fontWeight={'bold'} fontSize={'15px'}>
              Token
            </Text>
            <Flex>
              <Text letterSpacing={'1.3px'} fontSize={'13px'} mr={'5px'}>
                {commafy(Number(vault.vaultTokenAllocation))}{' '}
                {project.tokenSymbol}
              </Text>
              <Text letterSpacing={'1.3px'} fontSize={'13px'} color={'#7e8993'}>
                (12.00 %)
              </Text>
            </Flex>
          </GridItem>
          <GridItem
            fontFamily={theme.fonts.fld}
            className={'chart-cell'}
            border={themeDesign.border[colorMode]}
            borderRight={'none'}
            borderBottom={'none'}
            fontSize={'13px'}>
            <Text>Selected Pair</Text>
            <Text> {project.tokenSymbol} - TOS</Text>
          </GridItem>
          <GridItem
            fontFamily={theme.fonts.fld}
            className={'chart-cell'}
            border={themeDesign.border[colorMode]}
            borderRight={'none'}
            borderBottom={'none'}
            fontSize={'13px'}>
            <Text>Pool Address</Text>
            <Text>
              {vault.poolAddress ? shortenAddress(vault.poolAddress) : 'N/A'}
            </Text>
          </GridItem>
          <GridItem
            fontFamily={theme.fonts.fld}
            className={'chart-cell'}
            border={themeDesign.border[colorMode]}
            borderRight={'none'}
            borderBottom={'none'}
            fontSize={'13px'}>
            <Text>Vault Admin</Text>
            <Text>
              {vault.adminAddress ? shortenAddress(vault.adminAddress) : 'N/A'}
            </Text>
          </GridItem>
          <GridItem
            fontFamily={theme.fonts.fld}
            className={'chart-cell'}
            border={themeDesign.border[colorMode]}
            borderRight={'none'}
            fontSize={'13px'}>
            <Text>Vault Contract Address</Text>
            <Text>
              {vault.vaultAddress ? shortenAddress(vault.vaultAddress) : 'N/A'}
            </Text>{' '}
          </GridItem>
        </Flex>
        <Flex flexDirection={'column'} ml={'-40%'}>
          <GridItem
            fontFamily={theme.fonts.fld}
            className={'chart-cell'}
            border={themeDesign.border[colorMode]}
            borderBottom={'none'}>
            <Text w={'30%'} fontSize={'15px'}>
              Liquidity Rewards Program Listed
            </Text>
            <Flex w={'70%'} alignItems={'center'} justifyContent={'flex-end'}>
              <Flex flexDirection={'column'} mr={'20px'} textAlign={'right'}>
                <Text color={'#7e8993'}>You can create rewards program on</Text>
                <Text fontSize={'14px'}>Mar. 31, 2022 00:00:00 (KST)</Text>
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
          <GridItem
            fontFamily={theme.fonts.fld}
            className={'chart-cell'}
            justifyContent={'flex-start'}
            border={themeDesign.border[colorMode]}
            borderBottom={'none'}>
            <Text w={'17%'} fontSize={'18px'}>
              #10
            </Text>
            <Flex w={'40%'} flexDirection={'column'} mr={'50px'}>
              <Text color={'#7e8993'}>Reward Duration</Text>
              <Text>2021.03.09 13:25 - 2022.03.09 13:26</Text>
            </Flex>
            <Flex w={'25%'} flexDirection={'column'} mr={'20px'}>
              <Text color={'#7e8993'}>Refundable Amount</Text>
              <Flex alignItems={'baseline'}>
                <Text mr={'3px'} fontSize={'16px'}>
                  10,000,000
                </Text>{' '}
                <Text>TON</Text>
              </Flex>
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
            fontFamily={theme.fonts.fld}
            className={'chart-cell'}
            justifyContent={'flex-start'}
            border={themeDesign.border[colorMode]}
            borderBottom={'none'}>
            <Text w={'15%'} fontSize={'18px'}>
              #10
            </Text>
            <Flex flexDirection={'column'}>
              <Text color={'#7e8993'}>Reward Duration</Text>
              <Text>2021.03.09 13:25 - 2022.03.09 13:26</Text>
            </Flex>
          </GridItem>
          <GridItem
            fontFamily={theme.fonts.fld}
            className={'chart-cell'}
            justifyContent={'flex-start'}
            border={themeDesign.border[colorMode]}
            borderBottom={'none'}>
            <Text w={'15%'} fontSize={'18px'}>
              #10
            </Text>
            <Flex flexDirection={'column'}>
              <Text color={'#7e8993'}>Reward Duration</Text>
              <Text>2021.03.09 13:25 - 2022.03.09 13:26</Text>
            </Flex>
          </GridItem>
          <GridItem
            fontFamily={theme.fonts.fld}
            className={'chart-cell'}
            justifyContent={'center'}
            border={themeDesign.border[colorMode]}>
            <Text>Pagination...</Text>
          </GridItem>
        </Flex>
      </Grid>
      {vault.isDeployed ? (
        <PublicPageTable claim={vault.claim} />
      ) : (
        <Text>There are no claim round values</Text>
      )}
    </>
  );
};
