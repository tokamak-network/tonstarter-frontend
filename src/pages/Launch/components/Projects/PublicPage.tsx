import {FC, useState, useEffect} from 'react';
import {
  Flex,
  Text,
  Grid,
  GridItem,
  useTheme,
  useColorMode,
  Tooltip,
  Link,
  Button,
  Image,
} from '@chakra-ui/react';
import {PublicPageTable} from './PublicPageTable';
import {shortenAddress} from 'utils';
import momentTZ from 'moment-timezone';
import '../css/PublicPage.css';
import moment from 'moment';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import commafy from 'utils/commafy';
import * as PublicSaleVaultAbi from 'services/abis/PublicSaleVault.json';
import store from 'store';
import {toastWithReceipt} from 'utils';
import {setTxPending} from 'store/tx.reducer';
import {openToast} from 'store/app/toast.reducer';
import {useAppSelector} from 'hooks/useRedux';
import {selectTransactionType} from 'store/refetch.reducer';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {ethers} from 'ethers';
type PublicPage = {
  vault: any;
  project: any;
};

export const PublicPage: FC<PublicPage> = ({vault, project}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [buttonDisable, setButtonDisable] = useState<boolean>(false);
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const {account, library} = useActiveWeb3React();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const now = moment().unix();
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
  const PublicSaleVaul = new Contract(
    vault.vaultAddress,
    PublicSaleVaultAbi.abi,
    library,
  );
  useEffect(() => {
    if (account !== undefined && account !== null) {
      if (
        ethers.utils.getAddress(account) ===
        ethers.utils.getAddress(project.owner)
      ) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, [account, project]);

  const sendTOS = async () => {
    if (account === null || account === undefined || library === undefined) {
      return;
    }
    const signer = getSigner(library, account);
    try {
      const receipt = await PublicSaleVaul.connect(signer).depositWithdraw();
      store.dispatch(setTxPending({tx: true}));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, 'Launch');
        await receipt.wait();
      }
    } catch (e) {
      store.dispatch(setTxPending({tx: false}));
      store.dispatch(
        //@ts-ignore
        openToast({
          payload: {
            status: 'error',
            title: 'Tx fail to send',
            description: `something went wrong`,
            duration: 5000,
            isClosable: true,
          },
        }),
      );
    }
  };
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
      light: '#2a72e5',
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
            borderTopLeftRadius={'4px'}
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
                  Vault Admin Address
                </Text>
                <Link
                  isExternal
                  href={
                    vault.adminAddress
                      ? `https://rinkeby.etherscan.io/address/${vault.adminAddress}`
                      : ''
                  }
                  color={colorMode === 'light' ? '#353c48' : '#9d9ea5'}
                  _hover={{color: '#2a72e5'}}
                  fontFamily={theme.fonts.fld}>
                  {vault.adminAddress
                    ? shortenAddress(vault.adminAddress)
                    : 'NA'}
                </Link>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderRight={'none'}
                className={'chart-cell'}
                borderBottom={'none'}
                justifyContent={'space-between'}>
                <Text
                  fontFamily={theme.fonts.fld}
                  color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                  Vault Contract Address
                </Text>
                <Link
                  isExternal
                  href={
                    vault.vaultAddress
                      ? `https://rinkeby.etherscan.io/address/${vault.vaultAddress}`
                      : ''
                  }
                  color={colorMode === 'light' ? '#353c48' : '#9d9ea5'}
                  _hover={{color: '#2a72e5'}}
                  fontFamily={theme.fonts.fld}>
                  {vault.vaultAddress
                    ? shortenAddress(vault.vaultAddress)
                    : 'NA'}
                </Link>
              </GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderRight={'none'}
                borderBottomLeftRadius={'4px'}
                className={'chart-cell'}
                h={now >= vault.publicRound2 ? '95px' : ''}
                justifyContent={'space-between'}>
                <Flex flexDir={'column'}>
                  <Flex w={'273px'} justifyContent={'space-between'}>
                    <Text
                      fontFamily={theme.fonts.fld}
                      color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                      Address for receiving funds
                    </Text>
                    <Link
                      isExternal
                      href={
                        vault.addressForReceiving
                          ? `https://rinkeby.etherscan.io/address/${vault.addressForReceiving}`
                          : ''
                      }
                      color={colorMode === 'light' ? '#353c48' : '#9d9ea5'}
                      _hover={{color: '#2a72e5'}}
                      fontFamily={theme.fonts.fld}>
                      {vault.addressForReceiving
                        ? shortenAddress(vault.addressForReceiving)
                        : 'NA'}
                    </Link>
                  </Flex>
                  {now >= vault.publicRound2 ? (
                    <>
                      <Button
                        fontSize={'11px'}
                        w={'273px'}
                        h={'25px'}
                        mt={'5px'}
                        bg={'#257eee'}
                        color={'#ffffff'}
                        isDisabled={!isAdmin}
                        _disabled={{
                          color: colorMode === 'light' ? '#86929d' : '#838383',
                          bg: colorMode === 'light' ? '#e9edf1' : '#353535',
                          cursor: 'not-allowed',
                        }}
                        _hover={
                          !isAdmin
                            ? {}
                            : {
                                background: 'transparent',
                                border: 'solid 1px #2a72e5',
                                color: themeDesign.tosFont[colorMode],
                                cursor: 'pointer',
                              }
                        }
                        _active={
                          !isAdmin
                            ? {}
                            : {
                                background: '#2a72e5',
                                border: 'solid 1px #2a72e5',
                                color: '#fff',
                              }
                        }
                        onClick={() => sendTOS()}>
                        Send TOS to Initial Liquidity Vault & Receive Funds
                      </Button>
                    </>
                  ) : (
                    <></>
                  )}
                </Flex>
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
                <Flex justifyContent={'flex-start'} alignItems={'center'}>
                  <Text
                    fontFamily={theme.fonts.fld}
                    mr={'5px'}
                    color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                    Snapshot
                  </Text>
                  <Tooltip
                    label="Snapshot date must be set 1 week after Deployment completion"
                    hasArrow
                    placement="top"
                    color={colorMode === 'light' ? '#e6eaee' : '#424242'}
                    aria-label={'Tooltip'}
                    textAlign={'center'}
                    size={'xs'}>
                    <Image src={tooltipIcon} />
                  </Tooltip>
                </Flex>
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
                className={'chart-cell'}></GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderBottom={'none'}
                className={'chart-cell'}
                mr={'-1px'}></GridItem>
              <GridItem
                border={themeDesign.border[colorMode]}
                className={'chart-cell'}
                mr={'-1px'}
                h={now >= vault.publicRound2 ? '95px' : ''}>
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
            borderTopRadius={'4px'}
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
                <Text fontFamily={theme.fonts.fld} color={'#7e8993'}>
                  Tier
                </Text>
                <Text fontFamily={theme.fonts.fld} color={'#7e8993'}>
                  Required TOS
                </Text>
                <Text fontFamily={theme.fonts.fld} color={'#7e8993'}>
                  Allocated Token
                </Text>
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
              {[...Array(6 - sTosTier.length)].map((e: any, i: number) => {
                return (
                  <GridItem
                    border={themeDesign.border[colorMode]}
                    key={i}
                    borderBottomRightRadius={
                      i === 6 - sTosTier.length - 1 ? '4px' : 'none'
                    }
                    borderTop="none"
                    h={
                      now >= vault.publicRound2
                        ? i === 6 - sTosTier.length - 1
                          ? '94px'
                          : ''
                        : ''
                    }
                    borderLeft={'none'}
                    className={'chart-cell'}>
                    <Text fontFamily={theme.fonts.fld}>{''}</Text>
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
