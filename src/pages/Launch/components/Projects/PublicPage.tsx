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
  project: any;
};

export const PublicPage: FC<PublicPage> = ({vault, project}) => {
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
  // console.log('vault', vault);

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
    <Flex flexDirection={'column'}>
      <Grid templateColumns="repeat(3, 1fr)" w={'100%'}>
        <Flex flexDirection={'column'}>
          <GridItem
            border={themeDesign.border[colorMode]}
            borderRight={'none'}
            borderBottom={'none'}
            className={'chart-cell'}
            fontSize={'16px'}
            justifyContent={'space-between'}>
            <Text fontFamily={theme.fonts.fld}>Token</Text>
            {vault.isDeployed ? (
              <Text fontFamily={theme.fonts.fld}>
                {Number(vault.vaultTokenAllocation).toLocaleString()}
                {` `}
                {project.tokenSymbol}
              </Text>
            ) : (
              <></>
            )}
          </GridItem>
          {vault.isDeployed ? (
            <>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderRight={'none'}
                borderBottom={'none'}
                className={'chart-cell'}
                justifyContent={'space-between'}>
                <Text
                  fontFamily={theme.fonts.fld}
                  color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                  Public Round 1.
                </Text>
                <Flex>
                  <Text fontFamily={theme.fonts.fld} mr={'5px'}>
                    {` ${commafy(vault.publicRound1Allocation)} ${
                      project.tokenSymbol
                    }`}
                  </Text>
                  <Text
                    fontFamily={theme.fonts.fld}
                    color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                    {`(${
                      (
                        (Number(vault.publicRound1Allocation) /
                          Number(vault.vaultTokenAllocation)) *
                        100
                      )
                        .toFixed(3)
                        .replace(/\.(\d\d)\d?$/, '.$1') || '-'
                    }%)`}
                  </Text>
                </Flex>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderRight={'none'}
                borderBottom={'none'}
                className={'chart-cell'}
                justifyContent={'space-between'}>
                <Text
                  fontFamily={theme.fonts.fld}
                  color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                  Public Round 2.
                </Text>
                <Flex>
                  <Text fontFamily={theme.fonts.fld} mr={'5px'}>
                    {` ${commafy(vault.publicRound2Allocation)} ${
                      project.tokenSymbol
                    }`}
                  </Text>
                  <Text
                    fontFamily={theme.fonts.fld}
                    color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                    {`(${
                      (
                        (Number(vault.publicRound2Allocation) /
                          Number(vault.vaultTokenAllocation)) *
                        100
                      )
                        .toFixed(3)
                        .replace(/\.(\d\d)\d?$/, '.$1') || '-'
                    }%)`}
                  </Text>
                </Flex>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderRight={'none'}
                borderBottom={'none'}
                className={'chart-cell'}
                justifyContent={'space-between'}>
                <Text
                  fontFamily={theme.fonts.fld}
                  fontSize={'13px'}
                  w={'100px'}
                  color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                  Token Allocation for Liquidiy Pool
                </Text>
                <Flex>
                  <Text fontFamily={theme.fonts.fld} mr={'5px'}>
                    {`${(
                      (Number(vault.vaultTokenAllocation) *
                        Number(vault.tokenAllocationForLiquidity)) /
                      100
                    ).toLocaleString()}  ${project.tokenSymbol}`}{' '}
                  </Text>
                  <Text
                    fontFamily={theme.fonts.fld}
                    color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>{`(${
                    (vault.tokenAllocationForLiquidity * 1)
                      .toFixed(3)
                      .replace(/\.(\d\d)\d?$/, '.$1') || '-'
                  }%)`}</Text>
                </Flex>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderRight={'none'}
                borderBottom={'none'}
                className={'chart-cell'}
                justifyContent={'space-between'}>
                <Text
                  fontFamily={theme.fonts.fld}
                  color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                  Hard Cap
                </Text>
                <Text fontFamily={theme.fonts.fld}>{`${commafy(
                  vault.hardCap,
                )}  ${project.tokenSymbol}`}</Text>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderRight={'none'}
                borderBottom={'none'}
                className={'chart-cell'}
                justifyContent={'space-between'}>
                <Text
                  fontFamily={theme.fonts.fld}
                  color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                  Addres for receiving funds
                </Text>
                <Text fontFamily={theme.fonts.fld}>
                  {shortenAddress(vault.addressForReceiving)}
                </Text>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderRight={'none'}
                borderBottom={'none'}
                className={'chart-cell'}
                justifyContent={'space-between'}>
                <Text
                  fontFamily={theme.fonts.fld}
                  color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                  Vault Admin Address
                </Text>
                <Text fontFamily={theme.fonts.fld}>
                  {shortenAddress(vault.adminAddress)}
                </Text>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderRight={'none'}
                className={'chart-cell'}
                justifyContent={'space-between'}>
                <Text
                  fontFamily={theme.fonts.fld}
                  color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                  Vault Contract Address
                </Text>
                <Text fontFamily={theme.fonts.fld}>
                  {shortenAddress(vault.vaultAddress)}
                </Text>
              </GridItem>
            </>
          ) : (
            <>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderBottom={'none'}
                borderRight={'none'}
                className={'chart-cell'}
                fontSize={'16px'}></GridItem>
              <GridItem
                borderLeft={themeDesign.border[colorMode]}
                className={'chart-cell'}
                fontSize={'16px'}
                justifyContent={'center'}>
                <Flex>There are no token values</Flex>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderRight={'none'}
                className={'chart-cell'}
                fontSize={'16px'}
                borderTop={'none'}></GridItem>
            </>
          )}
        </Flex>
        <Flex flexDirection={'column'}>
          <GridItem
            border={themeDesign.border[colorMode]}
            borderRight={'none'}
            borderBottom={'none'}
            className={'chart-cell'}
            fontSize={'16px'}
            justifyContent={'space-between'}>
            <Text fontFamily={theme.fonts.fld}>Schedule</Text>
            {vault.isDeployed ? (
              <>
                <Text fontFamily={theme.fonts.fld}>
                  {momentTZ.tz(momentTZ.tz.guess()).zoneAbbr()}
                </Text>
              </>
            ) : (
              <></>
            )}
          </GridItem>
          {vault.isDeployed ? (
            <>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderRight={'none'}
                borderBottom={'none'}
                className={'chart-cell'}
                justifyContent={'space-between'}>
                <Text
                  fontFamily={theme.fonts.fld}
                  color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                  Snapshot
                </Text>
                <Text fontFamily={theme.fonts.fld}>
                  {moment.unix(vault.snapshot).format('YYYY.MM.DD HH:mm:ss')}
                </Text>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderRight={'none'}
                borderBottom={'none'}
                className={'chart-cell'}
                justifyContent={'space-between'}>
                <Text
                  fontFamily={theme.fonts.fld}
                  color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                  Whitelist
                </Text>
                <Text fontFamily={theme.fonts.fld}>
                  {moment.unix(vault.whitelist).format('YYYY.MM.DD HH:mm:ss')}
                </Text>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderRight={'none'}
                borderBottom={'none'}
                className={'chart-cell'}
                justifyContent={'space-between'}>
                <Text
                  fontFamily={theme.fonts.fld}
                  color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                  Public Round 1.
                </Text>
                <Text fontFamily={theme.fonts.fld}>
                  {moment
                    .unix(vault.publicRound1)
                    .format('YYYY.MM.DD HH:mm:ss')}
                </Text>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderRight={'none'}
                borderBottom={'none'}
                className={'chart-cell'}
                justifyContent={'space-between'}>
                <Text
                  fontFamily={theme.fonts.fld}
                  color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                  Public Round 2.
                </Text>
                <Text fontFamily={theme.fonts.fld}>
                  {moment
                    .unix(vault.publicRound2)
                    .format('YYYY.MM.DD HH:mm:ss')}
                </Text>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderRight={'none'}
                borderBottom={'none'}
                className={'chart-cell'}>
                <Text fontFamily={theme.fonts.fld}>{''}</Text>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderBottom={'none'}
                className={'chart-cell'}>
                <Text fontFamily={theme.fonts.fld}>{''}</Text>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                className={'chart-cell'}>
                <Text fontFamily={theme.fonts.fld}>{''}</Text>
              </GridItem>
            </>
          ) : (
            <>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderRight={'none'}
                borderBottom={'none'}
                className={'chart-cell'}
                fontSize={'16px'}></GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderRight={'none'}
                className={'chart-cell'}
                fontSize={'16px'}
                borderY={'none'}
                justifyContent={'center'}>
                <Flex>There are no token values</Flex>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderRight={'none'}
                className={'chart-cell'}
                fontSize={'16px'}
                paddingBottom={'32px'}
                borderTop={'none'}></GridItem>
            </>
          )}
          {/*  */}
        </Flex>
        <Flex flexDirection={'column'}>
          <GridItem
            border={themeDesign.border[colorMode]}
            borderBottom={'none'}
            className={'chart-cell'}
            fontSize={'16px'}
            justifyContent={'space-between'}>
            <Text fontFamily={theme.fonts.fld}>sTOS Tier</Text>
          </GridItem>
          {vault.isDeployed ? (
            <>
              {' '}
              <GridItem
                border={themeDesign.border[colorMode]}
                borderBottom={'none'}
                className={'chart-cell'}
                justifyContent={'space-between'}>
                <Text fontFamily={theme.fonts.fld}>Tier</Text>
                <Text fontFamily={theme.fonts.fld}>Required TOS</Text>
                <Text fontFamily={theme.fonts.fld}>Allocated Token</Text>
              </GridItem>
              {sTosTier?.map((data: any, index: number) => {
                const {tier, requiredStos, allocatedToken} = data;
                const publicRound1Allocation = vault.publicRound1Allocation;
                const percent =
                  (Number(allocatedToken) * 100) /
                  Number(publicRound1Allocation);

                return (
                  <GridItem
                    border={themeDesign.border[colorMode]}
                    borderBottom={index === sTosTier.length - 1 ? '' : 'none'}
                    className={'chart-cell'}
                    justifyContent={'space-between'}>
                    <Text fontFamily={theme.fonts.fld}>
                      {tier ? tier : index + 1}
                    </Text>
                    <Text fontFamily={theme.fonts.fld}>
                      {commafy(requiredStos) || '-'}
                    </Text>
                    <Flex justifyContent={'center'} alignItems={'center'}>
                      <Text fontFamily={theme.fonts.fld}>
                        {commafy(allocatedToken) || '-'}
                      </Text>
                      <Text
                        fontFamily={theme.fonts.fld}
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
                border={themeDesign.border[colorMode]}
                borderBottom={'none'}
                className={'chart-cell'}
                fontSize={'16px'}></GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                className={'chart-cell'}
                fontSize={'16px'}
                borderY={'none'}
                justifyContent={'center'}>
                <Flex>There are no token values</Flex>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                className={'chart-cell'}
                fontSize={'16px'}
                borderTop={'none'}></GridItem>
            </>
          )}
        </Flex>
      </Grid>
      {/* <Flex w={'100%'} justifyContent={'center'} py={'2rem'}>
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
      </Flex> */}
      <Flex w={'100%'} justifyContent={'center'} py={'2rem'}></Flex>
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
