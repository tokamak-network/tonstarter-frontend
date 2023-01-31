import {FC, useState, useEffect, useCallback} from 'react';
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
  Progress,
} from '@chakra-ui/react';
import {PublicPageTable} from './PublicPageTable';
import {shortenAddress} from 'utils';
import momentTZ from 'moment-timezone';
import '../css/PublicPage.css';
import moment from 'moment';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import commafy from 'utils/commafy';
import * as PublicSaleVaultAbi from 'services/abis/PublicSaleVault.json';
import * as PublicSaleVaultLogicAbi from 'services/abis/PublicSaleLogic.json';
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
import {BASE_PROVIDER, DEPLOYED} from 'constants/index';
import {useModal} from 'hooks/useModal';
import {useDispatch} from 'react-redux';
import {openModal} from 'store/modal.reducer';
import {convertNumber} from 'utils/number';

import * as WTONABI from 'services/abis/WTON.json';
import {useContract} from 'hooks/useContract';
type PublicPage = {
  vault: any;
  project: any;
};
const {WTON_ADDRESS} = DEPLOYED;

export const PublicPage: FC<PublicPage> = ({vault, project}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [buttonDisable, setButtonDisable] = useState<boolean>(false);
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const {account, library} = useActiveWeb3React();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [fundWithdrew, setFundWithdrew] = useState<boolean>(false);
  const {openAnyModal} = useModal();
  const [hardcap, setHardcap] = useState<number>(0);
  const [transferredTon, setTransferredTon] = useState(0);
  const network = BASE_PROVIDER._network.name;

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

  const PublicSaleContract = useContract(
    vault.vaultAddress,
    PublicSaleVaultLogicAbi.abi,
  );

  const sendTONtoVesting = useCallback(() => {
    if (PublicSaleContract) {
      return PublicSaleContract.depositWithdraw();
    }
  }, [PublicSaleContract]);

  const WTON = new Contract(WTON_ADDRESS, WTONABI.abi, library);
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
  }, [account, project, vault.vaultAddress, transactionType, blockNumber]);

  useEffect(() => {
    async function getHardCap() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      const hardCapCalc = await PublicSaleVaul.hardcapCalcul();
      const adminWithdraw = await PublicSaleVaul.adminWithdraw();
      setFundWithdrew(adminWithdraw);

      const wtonBalance = await WTON.balanceOf(vault.vaultAddress);
      const wt = convertNumber({amount: wtonBalance, type: 'ray'});
      const hc = convertNumber({amount: hardCapCalc});
      setHardcap(Number(hc));
      const transferred = Number(hc) - Number(wt);
      setTransferredTon(transferred);
    }
    getHardCap();
  }, [account, project, vault.vaultAddress, transactionType, blockNumber]);

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
  const download = () => {
    const datastr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(project));

    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', datastr);
    downloadAnchorNode.setAttribute('download', 'exportName' + '.csv');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const dispatch = useDispatch();

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
    headerFont: {
      light: '#353c48',
      dark: '#fff',
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
            <Text
              fontFamily={theme.fonts.fld}
              fontSize={'15px'}
              color={themeDesign.headerFont[colorMode]}>
              Token
            </Text>
            {vault.isDeployed ? (
              <Flex>
                <Text letterSpacing={'1.3px'} fontSize={'13px'} mr={'5px'}>
                  {commafy(Number(vault.vaultTokenAllocation))}{' '}
                  {project.tokenSymbol}
                </Text>
                <Text
                  letterSpacing={'1.3px'}
                  fontSize={'13px'}
                  color={'#7e8993'}>
                  {(
                    (vault.vaultTokenAllocation /
                      project.totalTokenAllocation) *
                    100
                  )
                    .toString()
                    .match(/^\d+(?:\.\d{0,2})?/)}
                  %
                </Text>
              </Flex>
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
                  w={'100px'}
                  color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                  Minimum Fund Raising Amount
                </Text>
                <Text fontFamily={theme.fonts.fld}>{`${commafy(
                  vault.hardCap,
                )}  TON`}</Text>
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
                    vault.adminAddress && network === 'goerli'
                      ? `https://goerli.etherscan.io/address/${vault.adminAddress}`
                      : vault.adminAddress && network !== 'goerli'
                      ? `https://etherscan.io/address/${vault.adminAddress}`
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
                    vault.vaultAddress && network === 'goerli'
                      ? `https://goerli.etherscan.io/address/${vault.vaultAddress}`
                      : vault.vaultAddress && network !== 'goerli'
                      ? `https://etherscan.io/address/${vault.vaultAddress}`
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
                h={now >= vault.publicRound2 ? '245px' : ''}>
                <Flex flexDir={'column'} w="100%">
                  <Text mb={'12px'} fontSize={'13px'} fontWeight={600}>
                    Fund Initialization
                  </Text>

                  <Flex color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                    <Flex
                      flexDir={'column'}
                      w="100%"
                      borderBottom={
                        colorMode === 'light'
                          ? '1px solid #e6eaee'
                          : '1px solid #373737'
                      }>
                      <Flex justifyContent={'space-between'} w="100%">
                        <Flex>
                          <Text
                            mr="5px"
                            fontSize={'13px'}
                            color={
                              colorMode === 'light' ? '#7e8993' : '#9d9ea5'
                            }>
                            {' '}
                            1. Fund Initial Liquidity Vault{' '}
                          </Text>
                          <Tooltip
                            label="Snapshot date must be set 1 week after Deployment completion"
                            hasArrow
                            placement="top"
                            color={
                              colorMode === 'light' ? '#e6eaee' : '#424242'
                            }
                            aria-label={'Tooltip'}
                            textAlign={'center'}
                            size={'xs'}>
                            <Image src={tooltipIcon} />
                          </Tooltip>
                        </Flex>
                        <Link
                          isExternal
                          href={
                            project.vaults[1].vaultAddress &&
                            network === 'goerli'
                              ? `https://goerli.etherscan.io/address/${project.vaults[1].vaultAddress}`
                              : vault.vaultAddress && network !== 'goerli'
                              ? `https://etherscan.io/address/${project.vaults[1].vaultAddress}`
                              : ''
                          }
                          color={colorMode === 'light' ? '#353c48' : '#9d9ea5'}
                          _hover={{color: '#2a72e5'}}
                          fontFamily={theme.fonts.fld}>
                          {project.vaults[1].vaultAddress
                            ? shortenAddress(project.vaults[1].vaultAddress)
                            : 'NA'}
                        </Link>
                      </Flex>
                      <Flex w="100%" flexDir={'column'}>
                        <Text textAlign={'right'} w="100%">
                          {transferredTon.toLocaleString()} /{' '}
                          {hardcap.toLocaleString()} TON
                        </Text>

                        <Progress
                          borderRadius={10}
                          h={'6px'}
                          bg={colorMode === 'light' ? '#e7edf3' : '#353d48'}
                          value={(transferredTon / hardcap) * 100}></Progress>
                      </Flex>
                      <Button
                        fontSize={'11px'}
                        w={'273px'}
                        h={'25px'}
                        mr={'2px'}
                        mt="12px"
                        bg={'#257eee'}
                        color={'#ffffff'}
                        onClick={() => {
                          dispatch(openModal({type: 'Launch_Swap', data: {}}));
                        }}>
                        Swap & Send
                      </Button>
                    </Flex>
                  </Flex>

                  <Flex>
                    <Flex
                      flexDir={'column'}
                      w="100%"
                      borderBottom={
                        colorMode === 'light'
                          ? '1px solid #e6eaee'
                          : '1px solid #373737'
                      }>
                      <Flex justifyContent={'space-between'} w="100%">
                        <Flex>
                          <Text
                            mr="5px"
                            fontSize={'13px'}
                            color={
                              colorMode === 'light' ? '#7e8993' : '#9d9ea5'
                            }>
                            {' '}
                            2. Initialize Vesting Vault
                          </Text>
                          <Tooltip
                            label="Snapshot date must be set 1 week after Deployment completion"
                            hasArrow
                            placement="top"
                            color={
                              colorMode === 'light' ? '#e6eaee' : '#424242'
                            }
                            aria-label={'Tooltip'}
                            textAlign={'center'}
                            size={'xs'}>
                            <Image src={tooltipIcon} />
                          </Tooltip>
                        </Flex>
                      </Flex>
                      <Button
                        fontSize={'11px'}
                        w={'273px'}
                        h={'25px'}
                        mr={'2px'}
                        mt="12px"
                        bg={'#257eee'}
                        color={'#ffffff'}
                        onClick={() => {
                          sendTONtoVesting();
                        }}>
                        Send TON
                      </Button>
                    </Flex>
                  </Flex>

                  {/* <Flex w={'273px'} justifyContent={'space-between'}>
                    <Text
                      fontFamily={theme.fonts.fld}
                      color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                      Address for receiving funds
                    </Text>
                    <Link
                      isExternal
                      href={
                        vault.addressForReceiving && network === 'goerli'
                          ? `https://goerli.etherscan.io/address/${vault.addressForReceiving}`
                          : vault.addressForReceiving && network !== 'goerli'
                          ? `https://etherscan.io/address/${vault.addressForReceiving}`
                          : ''
                      }
                      color={colorMode === 'light' ? '#353c48' : '#9d9ea5'}
                      _hover={{color: '#2a72e5'}}
                      fontFamily={theme.fonts.fld}>
                      {vault.addressForReceiving
                        ? shortenAddress(vault.addressForReceiving)
                        : 'NA'}
                    </Link>
                  </Flex> */}

                  {/* <Flex alignItems={'center'} mt={'5px'}>
                    <Button
                      fontSize={'11px'}
                      w={'273px'}
                      h={'25px'}
                      mr={'2px'}
                      bg={'#257eee'}
                      color={'#ffffff'}
                      // isDisabled={
                      //   vault.publicRound2End > moment().unix() ||
                      //   hardcap === 0 ||
                      //   fundWithdrew === true
                      // }
                      // isDisabled={true}
                      _disabled={{
                        color: colorMode === 'light' ? '#86929d' : '#838383',
                        bg: colorMode === 'light' ? '#e9edf1' : '#353535',
                        cursor: 'not-allowed',
                      }}
                      _hover={
                        vault.publicRound2End > moment().unix() ||
                        hardcap === 0 ||
                        fundWithdrew === true
                          ? {}
                          : {
                              cursor: 'pointer',
                            }
                      }
                      _focus={
                        vault.publicRound2End > moment().unix() ||
                        hardcap === 0 ||
                        fundWithdrew === true
                          ? {}
                          : {
                              background: 'transparent',
                              border: 'solid 1px #2a72e5',
                              color: themeDesign.tosFont[colorMode],
                              cursor: 'pointer',
                            }
                      }
                      _active={
                        vault.publicRound2End > moment().unix() ||
                        hardcap === 0 ||
                        fundWithdrew === true
                          ? {}
                          : {
                              background: '#2a72e5',
                              border: 'solid 1px #2a72e5',
                              color: '#fff',
                            }
                      }
                      onClick={() =>
                        dispatch(
                          openModal({
                            type: 'Launch_Swap',
                            data: {
                              publicVaultAddress: vault.vaultAddress,
                            },
                          }),
                        )
                      }>
                      Send Funds
                    </Button>
                  
                  </Flex> */}
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
            <Text
              fontFamily={theme.fonts.fld}
              fontSize={'15px'}
              color={themeDesign.headerFont[colorMode]}>
              Schedule
            </Text>
            {vault.isDeployed ? (
              <>
                <Text
                  fontFamily={theme.fonts.fld}
                  fontSize={'15px'}
                  color={themeDesign.headerFont[colorMode]}>
                  UTC {momentTZ.tz(momentTZ.tz.guess()).format('Z')}
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
                <Text
                  fontFamily={theme.fonts.fld}
                  w={'100px'}
                  textAlign={'right'}>
                  {moment.unix(vault.whitelist).format('YYYY.MM.DD HH:mm:ss')}{' '}
                  {`~`}{' '}
                  {moment.unix(vault.whitelistEnd).format('MM.DD HH:mm:ss')}
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
                <Text
                  fontFamily={theme.fonts.fld}
                  w={'100px'}
                  textAlign={'right'}>
                  {moment
                    .unix(vault.publicRound1)
                    .format('YYYY.MM.DD HH:mm:ss')}{' '}
                  {`~`}{' '}
                  {moment.unix(vault.publicRound1End).format('MM.DD HH:mm:ss')}
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
                <Text
                  fontFamily={theme.fonts.fld}
                  w={'100px'}
                  textAlign={'right'}>
                  {moment
                    .unix(vault.publicRound2)
                    .format('YYYY.MM.DD HH:mm:ss')}{' '}
                  {`~`}{' '}
                  {moment.unix(vault.publicRound2End).format('MM.DD HH:mm:ss')}
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
                h={now >= vault.publicRound2 ? '245px' : ''}>
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
            borderTopRightRadius={'4px'}
            className={'chart-cell'}
            fontSize={'16px'}
            justifyContent={'space-between'}>
            <Text
              fontFamily={theme.fonts.fld}
              fontSize={'15px'}
              color={themeDesign.headerFont[colorMode]}>
              sTOS Tier
            </Text>
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
                  Required sTOS
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
                    key={index}
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
                          ? '244px'
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

      {/* <Flex w={'100%'} justifyContent={'center'} py={'2rem'}> */}
      {/* <Button
          className="button-style"
          background={'none'}
          h={'38px'}
          mr='12px'
          fontSize='13px'
          w={'150px'}
        flexDirection='column'
          py={'10px'}
          _hover={{background:'transparent'}}
          _active={{background:'transparent'}}
          onClick={() => openAnyModal('Launch_Increase', {
            symbol: 'LYDA',
            amount: '56,780,000'
          })}
          // disabled={!vault.isDeployed}
          // onClick={() => openAnyModal('Launch_Download', {})}
        > <Text  
        textAlign={'center'}
        w="150px"
        wordBreak={'break-word'}>
           Send TOS to Initial
        </Text>
        <Text> Liquidity Vault</Text>
         
        </Button> */}
      {/* <Button
          className="button-style"
          background={'none'}
          px={'45px'}
          py={'10px'}
          h={'38px'}
          fontSize='14px'
          w={'150px'}
          //  disabled={!vault.isDeployed}
          // onClick={() => openAnyModal('Launch_Download', {})}
        >
          Download
        </Button> */}
      {/* </Flex> */}
      <Flex w={'100%'} justifyContent={'center'} py={'2rem'}></Flex>
      {/* <Button w="125px" id="downloadAnchorElem" onClick={() => download()}>
        Download
      </Button> */}
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
