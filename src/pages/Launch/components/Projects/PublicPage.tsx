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
import {shortenAddress} from 'utils';
import momentTZ from 'moment-timezone';
import '../css/PublicPage.css';
import moment from 'moment';
import commafy from 'utils/commafy';
type PublicPage = {
  vault: any;
  tokenSymbol: string;
};

export const PublicPage: FC<PublicPage> = ({vault, tokenSymbol}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const sTosTier = vault.stosTier
    ? Object.keys(vault.stosTier)
        .map((tier) => {
          const tierNum =
            tier === 'oneTier'
              ? 1
              : tier === 'twoTier'
              ? 2
              : tier === 'threeTier'
              ? 3
              : 4;
          return {
            tier: tierNum,
            allocatedToken: vault.stosTier[tier].allocatedToken,
            requiredStos: vault.stosTier[tier].requiredStos,
          };
        })
        .sort((a, b) => a.tier - b.tier)
    : [];
  console.log('vault', vault);

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
    <Flex flexDirection={'column'}>
      <Grid templateColumns="repeat(3, 1fr)" w={'100%'}>
        <Flex flexDirection={'column'}>
          <GridItem
            className={'chart-cell no-border-right no-border-bottom'}
            fontSize={'16px'}
            justifyContent={'space-between'}>
            <Text>Token</Text>
            {vault.isDeployed ? (
              <Text>
                {Number(vault.vaultTokenAllocation).toLocaleString()}
                {` `}
                {tokenSymbol}
              </Text>
            ) : (
              <></>
            )}
          </GridItem>
          {vault.isDeployed ? (
            <>
              <GridItem
                className={'chart-cell no-border-right no-border-bottom'}
                justifyContent={'space-between'}>
                <Text>Public Round 1.</Text>
                <Text>
                  {` ${commafy(vault.publicRound1Allocation)} ${tokenSymbol} (${
                    (Number(vault.publicRound1Allocation) /
                      Number(vault.vaultTokenAllocation)) *
                    100
                  }%)`}{' '}
                </Text>
              </GridItem>
              <GridItem
                className={'chart-cell no-border-right no-border-bottom'}
                justifyContent={'space-between'}>
                <Text>Public Round 2.</Text>
                <Text>
                  {` ${commafy(vault.publicRound2Allocation)} ${tokenSymbol} (${
                    (Number(vault.publicRound2Allocation) /
                      Number(vault.vaultTokenAllocation)) *
                    100
                  }%)`}
                </Text>
              </GridItem>
              <GridItem
                className={'chart-cell no-border-right no-border-bottom'}
                justifyContent={'space-between'}>
                <Text fontSize={'13px'} w={'100px'}>
                  Token Allocation for Liquidiy Pool
                </Text>
                <Text>{`${(
                  (Number(vault.vaultTokenAllocation) *
                    Number(vault.tokenAllocationForLiquidity)) /
                  100
                ).toLocaleString()}  ${tokenSymbol} (${
                  vault.tokenAllocationForLiquidity
                }%)`}</Text>
              </GridItem>
              <GridItem
                className={'chart-cell no-border-right no-border-bottom'}
                justifyContent={'space-between'}>
                <Text>Hard Cap</Text>
                <Text>{`${commafy(vault.hardCap)}  ${tokenSymbol}`}</Text>
              </GridItem>
              <GridItem
                className={'chart-cell no-border-right no-border-bottom'}
                justifyContent={'space-between'}>
                <Text>Addres for receiving funds</Text>
                <Text>{shortenAddress(vault.addressForReceiving)}</Text>
              </GridItem>
              <GridItem
                className={'chart-cell no-border-right no-border-bottom'}
                justifyContent={'space-between'}>
                <Text>Vault Admin Address</Text>
                <Text>{shortenAddress(vault.adminAddress)}</Text>
              </GridItem>
              <GridItem
                className={'chart-cell no-border-right'}
                justifyContent={'space-between'}>
                <Text>Vault Contract Address</Text>
                <Text>{shortenAddress(vault.vaultAddress)}</Text>
              </GridItem>
            </>
          ) : (
            <>
              <GridItem
                className={'chart-cell no-border-right no-border-bottom'}
                fontSize={'16px'}
                borderBottom={'none'}></GridItem>
              <GridItem
                className={'chart-cell no-border-right no-border-bottom'}
                fontSize={'16px'}
                borderY={'none'}
                justifyContent={'center'}>
                <Flex>There are no token values</Flex>
              </GridItem>
              <GridItem
                className={'chart-cell no-border-right'}
                fontSize={'16px'}
                borderTop={'none'}></GridItem>
            </>
          )}
        </Flex>
        <Flex flexDirection={'column'}>
          <GridItem
            className={'chart-cell no-border-right no-border-bottom'}
            fontSize={'16px'}
            justifyContent={'space-between'}>
            <Text>Schedule</Text>
            {vault.isDeployed ? (
              <>
                <Text>{momentTZ.tz(momentTZ.tz.guess()).zoneAbbr()}</Text>
              </>
            ) : (
              <></>
            )}
          </GridItem>
          {vault.isDeployed ? (
            <>
              <GridItem
                className={'chart-cell no-border-right no-border-bottom'}
                justifyContent={'space-between'}>
                <Text>Snapshot</Text>
                <Text>
                  {moment.unix(vault.snapshot).format('YYYY.MM.DD HH:mm:ss')}
                </Text>
              </GridItem>
              <GridItem
                className={'chart-cell no-border-right no-border-bottom'}
                justifyContent={'space-between'}>
                <Text>Whitelist</Text>
                <Text>
                  {moment.unix(vault.whitelist).format('YYYY.MM.DD HH:mm:ss')}
                </Text>
              </GridItem>
              <GridItem
                className={'chart-cell no-border-right no-border-bottom'}
                justifyContent={'space-between'}>
                <Text>Public Round 1.</Text>
                <Text>
                  {moment
                    .unix(vault.publicRound1)
                    .format('YYYY.MM.DD HH:mm:ss')}
                </Text>
              </GridItem>
              <GridItem
                className={'chart-cell no-border-right no-border-bottom'}
                justifyContent={'space-between'}>
                <Text>Public Round 2.</Text>
                <Text>
                  {moment
                    .unix(vault.publicRound2)
                    .format('YYYY.MM.DD HH:mm:ss')}
                </Text>
              </GridItem>
              <GridItem
                className={'chart-cell no-border-right no-border-bottom'}>
                <Text>{''}</Text>
              </GridItem>
              <GridItem className={'chart-cell no-border-bottom'}>
                <Text>{''}</Text>
              </GridItem>
              <GridItem className={'chart-cell'}>
                <Text>{''}</Text>
              </GridItem>
            </>
          ) : (
            <>
              <GridItem
                className={'chart-cell no-border-right no-border-bottom'}
                fontSize={'16px'}
                borderBottom={'none'}></GridItem>
              <GridItem
                className={'chart-cell no-border-right no-border-bottom'}
                fontSize={'16px'}
                borderY={'none'}
                justifyContent={'center'}>
                <Flex>There are no token values</Flex>
              </GridItem>
              <GridItem
                className={'chart-cell no-border-right'}
                fontSize={'16px'}
                borderTop={'none'}></GridItem>
            </>
          )}
          {/*  */}
        </Flex>
        <Flex flexDirection={'column'}>
          <GridItem
            className={'chart-cell no-border-bottom'}
            fontSize={'16px'}
            justifyContent={'space-between'}>
            <Text>sTOS Tier</Text>
          </GridItem>
          {vault.isDeployed ? (
            <>
              {' '}
              <GridItem
                className={'chart-cell no-border-bottom'}
                justifyContent={'space-between'}>
                <Text>Tier</Text>
                <Text>Required TOS</Text>
                <Text>Allocated Token</Text>
              </GridItem>
              {sTosTier?.map((data: any, index: number) => {
                const {tier, requiredStos, allocatedToken} = data;
                const publicRound1Allocation = vault.publicRound1Allocation;
                const percent =
                  (Number(allocatedToken) * 100) /
                  Number(publicRound1Allocation);

                return (
                  <GridItem
                    className={`chart-cell ${
                      index === sTosTier.length - 1 ? '' : 'no-border-bottom'
                    }`}
                    justifyContent={'space-between'}>
                    <Text>{tier ? tier : index + 1}</Text>
                    <Text>{commafy(requiredStos) || '-'}</Text>
                    <Flex justifyContent={'center'} alignItems={'center'}>
                      <Text>{commafy(allocatedToken) || '-'}</Text>
                      <Text
                        ml={'5px'}
                        color={'#7e8993'}
                        textAlign={'center'}
                        lineHeight={'32px'}
                        fontWeight={100}>
                        {isNaN(percent)
                          ? '(- %)'
                          : `(${
                              Number(percent)
                                .toFixed(3)
                                .replace(/\.(\d\d)\d?$/, '.$1') || '-'
                            }%)`}
                      </Text>
                    </Flex>
                  </GridItem>
                );
              })}
            </>
          ) : (
            <>
              <GridItem
                className={'chart-cell'}
                fontSize={'16px'}
                borderBottom={'none'}></GridItem>
              <GridItem
                className={'chart-cell'}
                fontSize={'16px'}
                borderY={'none'}
                justifyContent={'center'}>
                <Flex>There are no token values</Flex>
              </GridItem>
              <GridItem
                className={'chart-cell'}
                fontSize={'16px'}
                borderTop={'none'}></GridItem>
            </>
          )}
        </Flex>
      </Grid>
      <Flex w={'100%'} justifyContent={'center'} py={'2rem'}>
        <Button
          className="button-style"
          background={'none'}
          px={'45px'}
          py={'10px'}
          disabled={!vault.isDeployed}
          // onClick={() => openAnyModal('Launch_Download', {})}
        >
          Download
        </Button>
      </Flex>
      {vault.isDeployed ? (
        <PublicPageTable claim={vault.claim} />
      ) : (
        <Flex
          justifyContent={'center'}
          width={'100%'}
          mt={'50px'}
          color={colorMode === 'light' ? '#9d9ea5' : '#7e8993'}
          fontFamily={theme.fonts.fld}>
          There are no claim round values
        </Flex>
      )}
    </Flex>
  );
};
