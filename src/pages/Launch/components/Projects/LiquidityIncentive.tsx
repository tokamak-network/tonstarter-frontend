import {FC, useEffect, useState} from 'react';
import {
  Flex,
  Text,
  Grid,
  GridItem,
  useTheme,
  useColorMode,
  Button,
  Tooltip,
  IconButton,
  Link,
} from '@chakra-ui/react';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {PublicPageTable} from './PublicPageTable';
import {useModal} from 'hooks/useModal';
import {shortenAddress} from 'utils/address';
import commafy from 'utils/commafy';
import {BASE_PROVIDER} from 'constants/index';
import VaultLPRewardLogicAbi from 'services/abis/VaultLPRewardLogicAbi.json';
import {ethers} from 'ethers';
import store from 'store';
import {toastWithReceipt} from 'utils';
import {setTxPending} from 'store/tx.reducer';
import {openToast} from 'store/app/toast.reducer';
import {useAppSelector} from 'hooks/useRedux';
import {selectTransactionType} from 'store/refetch.reducer';
import {Contract} from '@ethersproject/contracts';
import {getSigner} from 'utils/contract';
import {useActiveWeb3React} from 'hooks/useWeb3';
import moment from 'moment';
import momentTZ from 'moment-timezone';
type LiquidityIncentive = {vault: any; project: any};

export const LiquidityIncentive: FC<LiquidityIncentive> = ({
  vault,
  project,
}) => {
  const {colorMode} = useColorMode();
  const {openAnyModal} = useModal();
  const theme = useTheme();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(5);
  const [pageOptions, setPageOptions] = useState<number>(0);
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const network = BASE_PROVIDER._network.name;
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const {account, library} = useActiveWeb3React();
  const [distributable, setDistributable] = useState<number>(0);
  const [claimTime, setClaimTime] = useState<number>(0);
  const [showDate, setShowDate] = useState<boolean>(false);
  const [distributeDisable, setDistributeDisable] = useState<boolean>(true);

  const VaultLPReward = new Contract(
    vault.vaultAddress,
    VaultLPRewardLogicAbi.abi,
    library,
  );
  console.log(VaultLPReward);
  
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
      dark: '#fff',
    },
    buttonColorInactive: {
      light: '#c9d1d8',
      dark: '#777777',
    },
  };


  useEffect(() => {
    async function getLPToken() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      const now = moment().unix();
      const signer = getSigner(library, account);
      const currentRound = await VaultLPReward.connect(signer).currentRound();
      const nowClaimRound = await VaultLPReward.connect(signer).nowClaimRound();
      const amount = await VaultLPReward.connect(signer).claimAmounts(
        currentRound,
      );
      const totalClaimCount = await VaultLPReward.connect(
        signer,
      ).totalClaimCounts();
      setDistributeDisable(Number(nowClaimRound) >= Number(currentRound));
      const disabled = Number(nowClaimRound) >= Number(currentRound);
      const claimDate =
        Number(currentRound) === Number(totalClaimCount)
          ? await VaultLPReward.connect(signer).claimTimes(
              Number(currentRound) - 1,
            )
          : await VaultLPReward.connect(signer).claimTimes(currentRound);
      const amountFormatted = parseInt(amount);
      setShowDate(amountFormatted === 0 && Number(claimDate) > now);
      setClaimTime(claimDate);
      setDistributable(amountFormatted);
    }
    getLPToken();
  }, [account, library, transactionType, blockNumber]);


const createReward = async() => {
  if (account === null || account === undefined || library === undefined) {
    return;
  }
  const signer = getSigner(library, account);
  try {
    const receipt = await VaultLPReward.connect(signer).createProgram();
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
}

  const fakeData = [
    {name: '1'},
    {name: '2'},
    {name: '3'},
    {name: '4'},
    {name: '5'},
    {name: '6'},
    {name: '7'},
    {name: '8'},
  ];

  const getPaginatedData = () => {
    const startIndex = pageIndex * pageLimit - pageLimit;
    const endIndex = startIndex + pageLimit;
    return fakeData.slice(startIndex, endIndex);
  };

  const goToNextPage = () => {
    setPageIndex(pageIndex + 1);
  };

  const gotToPreviousPage = () => {
    setPageIndex(pageIndex - 1);
  };

  const changePage = (pageNumber: number) => {
    setPageIndex(pageNumber);
    getPaginationGroup();
  };

  const getPaginationGroup = () => {
    let start = Math.floor((pageIndex - 1) / 5) * 5;
    const group = new Array(5).fill(1).map((_, idx) => start + idx + 1);
    return group;
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
            <Link
              isExternal
              href={
                vault.poolAddress && network === 'rinkeby'
                  ? `https://rinkeby.etherscan.io/address/${vault.poolAddress}`
                  : vault.poolAddress && network !== 'rinkeby'
                  ? `https://etherscan.io/address/${vault.poolAddress}`
                  : ''
              }
              color={colorMode === 'light' ? '#353c48' : '#9d9ea5'}
              _hover={{color: '#2a72e5'}}
              fontFamily={theme.fonts.fld}>
              {vault.poolAddress ? shortenAddress(vault.poolAddress) : 'NA'}
            </Link>
          </GridItem>
          <GridItem
            fontFamily={theme.fonts.fld}
            className={'chart-cell'}
            border={themeDesign.border[colorMode]}
            borderRight={'none'}
            borderBottom={'none'}
            fontSize={'13px'}>
            <Text>Vault Admin</Text>
            <Link
              isExternal
              href={
                vault.adminAddress && network === 'rinkeby'
                  ? `https://rinkeby.etherscan.io/address/${vault.adminAddress}`
                  : vault.adminAddress && network !== 'rinkeby'
                  ? `https://etherscan.io/address/${vault.adminAddress}`
                  : ''
              }
              color={colorMode === 'light' ? '#353c48' : '#9d9ea5'}
              _hover={{color: '#2a72e5'}}
              fontFamily={theme.fonts.fld}>
              {vault.adminAddress ? shortenAddress(vault.adminAddress) : 'NA'}
            </Link>
          </GridItem>
          <GridItem
            fontFamily={theme.fonts.fld}
            className={'chart-cell'}
            border={themeDesign.border[colorMode]}
            borderRight={'none'}
            fontSize={'13px'}>
            <Text>Vault Contract Address</Text>
            <Link
              isExternal
              href={
                vault.vaultAddress && network === 'rinkeby'
                  ? `https://rinkeby.etherscan.io/address/${vault.vaultAddress}`
                  : vault.vaultAddress && network !== 'rinkeby'
                  ? `https://etherscan.io/address/${vault.vaultAddress}`
                  : ''
              }
              color={colorMode === 'light' ? '#353c48' : '#9d9ea5'}
              _hover={{color: '#2a72e5'}}
              fontFamily={theme.fonts.fld}>
              {vault.vaultAddress ? shortenAddress(vault.vaultAddress) : 'NA'}
            </Link>
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
                <Text fontSize={'14px'}>  {moment.unix(claimTime).format('MMM. DD, yyyy HH:mm:ss')}{' '}
                    ({momentTZ.tz(momentTZ.tz.guess()).zoneAbbr()})</Text>
              </Flex>
              <Button
                bg={'#257eee'}
                fontSize={'12px'}
                height={'40px'}
                width={'120px'}
                padding={'6px 12px'}
                whiteSpace={'normal'}
                color={'#fff'}
                isDisabled={distributeDisable}
                _disabled={{
                  color: colorMode === 'light' ? '#86929d' : '#838383',
                  bg: colorMode === 'light' ? '#e9edf1' : '#353535',
                  cursor: 'not-allowed',
                }}
                _hover={
                  disableButton
                    ? {}
                    : {
                        background: 'transparent',
                        border: 'solid 1px #2a72e5',
                        color: themeDesign.tosFont[colorMode],
                        cursor: 'pointer',
                      }
                }
                _active={
                  disableButton
                    ? {}
                    : {
                        background: '#2a72e5',
                        border: 'solid 1px #2a72e5',
                        color: '#fff',
                      }
                }
                onClick={() => openAnyModal('Launch_CreateRewardProgram', {
                  createReward
                })}>
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
                {distributable.toLocaleString()}
                </Text>{' '}
                <Text> {project.tokenSymbol}</Text>
              </Flex>
            </Flex>
            <Button
              bg={'#257eee'}
              fontSize={'12px'}
              padding={'6px 41px 5px'}
              height={'25px'}
              borderRadius={'4px'}
              width={'120px'}
              color={'#fff'}
              // isDisabled={disableButton}
              _disabled={{
                color: colorMode === 'light' ? '#86929d' : '#838383',
                bg: colorMode === 'light' ? '#e9edf1' : '#353535',
                cursor: 'not-allowed',
              }}
              _hover={
                // I set !disableButton just for UI testing purposes. Revert to disableButton (or any condition) to disable _hover and _active styles.
                !disableButton
                  ? {}
                  : {
                      background: 'transparent',
                      border: 'solid 1px #2a72e5',
                      color: themeDesign.tosFont[colorMode],
                      cursor: 'pointer',
                    }
              }
              _active={
                !disableButton
                  ? {}
                  : {
                      background: '#2a72e5',
                      border: 'solid 1px #2a72e5',
                      color: '#fff',
                    }
              }>
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
            <Flex flexDirection={'row'} justifyContent={'center'}>
              <Flex>
                <Tooltip label="Previous Page">
                  <IconButton
                    minW={'24px'}
                    h={'24px'}
                    bg={colorMode === 'light' ? 'white.100' : 'none'}
                    border={
                      colorMode === 'light'
                        ? 'solid 1px #e6eaee'
                        : 'solid 1px #424242'
                    }
                    color={colorMode === 'light' ? '#e6eaee' : '#424242'}
                    borderRadius={4}
                    aria-label={'Previous Page'}
                    onClick={gotToPreviousPage}
                    isDisabled={pageIndex === 1}
                    size={'sm'}
                    mr={4}
                    _active={{background: 'transparent'}}
                    _hover={{
                      borderColor:
                        colorMode === 'light' ? '#3e495c' : '#2a72e5',
                      color: colorMode === 'light' ? '#3e495c' : '#2a72e5',
                    }}
                    icon={<ChevronLeftIcon h={6} w={6} />}
                  />
                </Tooltip>
              </Flex>
              <Flex>
                {getPaginationGroup().map(
                  (groupIndex: number, index: number) => {
                    return (
                      <Button
                        h="24px"
                        key={index}
                        minW="24px"
                        background="transparent"
                        fontFamily={theme.fonts.roboto}
                        fontSize="13px"
                        fontWeight="normal"
                        color={
                          pageIndex === groupIndex
                            ? themeDesign.buttonColorActive[colorMode]
                            : themeDesign.buttonColorInactive[colorMode]
                        }
                        p="0px"
                        _hover={{
                          background: 'transparent',
                          color: themeDesign.buttonColorActive[colorMode],
                        }}
                        _active={{background: 'transparent'}}
                        // disabled={pageOptions < groupIndex}
                        onClick={() => changePage(groupIndex)}>
                        {groupIndex}
                      </Button>
                    );
                  },
                )}
              </Flex>
              <Flex>
                <Tooltip label="Next Page">
                  <IconButton
                    minW={'24px'}
                    h={'24px'}
                    border={
                      colorMode === 'light'
                        ? 'solid 1px #e6eaee'
                        : 'solid 1px #424242'
                    }
                    color={colorMode === 'light' ? '#e6eaee' : '#424242'}
                    bg={colorMode === 'light' ? 'white.100' : 'none'}
                    borderRadius={4}
                    aria-label={'Next Page'}
                    onClick={goToNextPage}
                    isDisabled={pageIndex === pageOptions}
                    size={'sm'}
                    ml={4}
                    mr={'1.5625em'}
                    _active={{background: 'transparent'}}
                    _hover={{
                      borderColor:
                        colorMode === 'light' ? '#3e495c' : '#2a72e5',
                      color: colorMode === 'light' ? '#3e495c' : '#2a72e5',
                    }}
                    icon={<ChevronRightIcon h={6} w={6} />}
                  />
                </Tooltip>
              </Flex>
            </Flex>
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
