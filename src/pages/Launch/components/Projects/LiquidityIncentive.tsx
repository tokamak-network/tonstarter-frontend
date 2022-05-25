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
import {DEPLOYED, BASE_PROVIDER} from 'constants/index';
import * as UniswapV3FactoryABI from 'services/abis/UniswapV3Factory.json';
import {createReward, getRandomKey} from 'pages/Reward/components/api';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import {soliditySha3} from 'web3-utils';

import {addPool} from 'pages/Admin/actions/actions';
import views from 'pages//Reward/rewards';
import {interfaceReward} from 'pages/Reward/types';
const provider = BASE_PROVIDER;
const {TOS_ADDRESS, UniswapV3Factory, NPM_Address, UniswapStaker_Address} =
  DEPLOYED;
type LiquidityIncentive = {vault: any; project: any};
type Key = {
  rewardToken: string;
  pool: string;
  startTime: number;
  endTime: number;
  refundee: string;
};
export const LiquidityIncentive: FC<LiquidityIncentive> = ({
  vault,
  project,
}) => {
  const {colorMode} = useColorMode();
  const {openAnyModal} = useModal();
  const theme = useTheme();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(3);
  const [pageOptions, setPageOptions] = useState<number>(0);
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const network = BASE_PROVIDER._network.name;
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const {account, library, chainId} = useActiveWeb3React();
  const [distributable, setDistributable] = useState<number>(0);
  const [claimTime, setClaimTime] = useState<number>(0);
  const [showDate, setShowDate] = useState<boolean>(false);
  const [distributeDisable, setDistributeDisable] = useState<boolean>(true);
  const [duration, setDuration] = useState<any[]>([0, 0]);
  const [pool, setPool] = useState<string>('');
  const [endTime, setEndTime] = useState<number>(0);
  const [poolsFromAPI, setPoolsFromAPI] = useState<any>([]);
  const [datas, setDatas] = useState<interfaceReward[] | []>([]);
  const zero_address = '0x0000000000000000000000000000000000000000';
  const VaultLPReward = new Contract(
    vault.vaultAddress,
    VaultLPRewardLogicAbi.abi,
    library,
  );
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

  const UniswapV3Fact = new Contract(
    UniswapV3Factory,
    UniswapV3FactoryABI.abi,
    library,
  );

  const uniswapStakerContract = new Contract(
    UniswapStaker_Address,
    STAKERABI.abi,
    library,
  );
  useEffect(() => {
    async function getLPToken() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      const now = moment().unix();
      const currentRound = await VaultLPReward.currentRound();
      const nowClaimRound = await VaultLPReward.nowClaimRound();
      const totalClaimCount = await VaultLPReward.totalClaimCounts();
      const available = await VaultLPReward.availableUseAmount(currentRound);
      const amountFormatted = parseInt(ethers.utils.formatEther(available));
      const getProgramDuration = await VaultLPReward.getProgramDuration(
        currentRound,
      );
      const claimDate =
        nowClaimRound === totalClaimCount
          ? 0
          : await VaultLPReward.claimTimes(nowClaimRound);
      const endTime = Number(claimDate) + Number(getProgramDuration);
      const durat = [Number(claimDate), endTime];
      setEndTime(Number(getProgramDuration));

      setDuration(durat);
      const getPool = await UniswapV3Fact.getPool(
        TOS_ADDRESS,
        project.tokenAddress,
        3000,
      );
      setPool(getPool);
      setDistributeDisable(false);
      const disabled = Number(nowClaimRound) >= Number(currentRound);
      setShowDate(amountFormatted === 0 && Number(claimDate) > now);
      setClaimTime(claimDate);
      setDistributable(amountFormatted);
    }
    getLPToken();
  }, [account, library, transactionType, blockNumber, vault.vaultAddress]);

  async function fetchProjectsData() {
    if (account === null || account === undefined || library === undefined) {
      return;
    }
    const signer = getSigner(library, account);
    const rewardData = await views.getRewardData();
    if (rewardData) {
      const res = await Promise.all(
        rewardData.map(async (reward: any, index) => {
          reward.index = index + 1;
          const key = reward.incentiveKey;
          const abicoder = ethers.utils.defaultAbiCoder;
          const incentiveABI =
            'tuple(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)';

          const incentiveId = soliditySha3(
            abicoder.encode([incentiveABI], [key]),
          );
          const incentiveInfo = await uniswapStakerContract
            .connect(signer)
            .incentives(incentiveId);
          reward.unclaimed = incentiveInfo.totalRewardUnclaimed;
          return {...reward};
        }),
      );

      const filtered = rewardData.filter(
        (reward: any) =>
          ethers.utils.getAddress(reward.incentiveKey.refundee) ===
          ethers.utils.getAddress(vault.vaultAddress),
      );

      setDatas(filtered);
    }
  }
  useEffect(() => {
    fetchProjectsData();
  }, [account, library, vault.vaultAddress, transactionType, blockNumber]);

  const generateSig = async (account: string, key: any) => {
    const randomvalue = await getRandomKey(account);
    // const pool = '0x516e1af7303a94f81e91e4ac29e20f4319d4ecaf';
    //@ts-ignore
    const web3 = new Web3(window.ethereum);
    if (randomvalue != null) {
      const randomBn = new BigNumber(randomvalue).toFixed(0);
      const soliditySha3 = await web3.utils.soliditySha3(
        {type: 'string', value: account},
        {type: 'uint256', value: randomBn},
        {type: 'string', value: key.rewardToken},
        {type: 'string', value: key.pool},
        {type: 'uint256', value: key.startTime},
        {type: 'uint256', value: key.endTime},
      );
      //@ts-ignore
      const sig = await web3.eth.personal.sign(soliditySha3, account, '');

      return sig;
    } else {
      return '';
    }
  };

  const createRewardFirst = async () => {
    if (account === null || account === undefined || library === undefined) {
      return;
    }
    const signer = getSigner(library, account);

    try {
      const receipt = await VaultLPReward.connect(signer).createProgram();
      store.dispatch(setTxPending({tx: true}));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, 'Launch');
        const res = await receipt.wait();
        const blockNum = res.blockNumber;
        const block = await provider.getBlock(blockNum);
        const timeStamp = block.timestamp;
        const startTime = Number(timeStamp) + 60;
        const endTimestamp = endTime;
        const poolAddress = pool;
        const rewardToken = project.tokenAddress;
        const refundee = vault.vaultAddress;
        const allocatedReward = ethers.utils.parseEther(
          distributable.toString(),
        );
        const poolName = `TOS / ${project.tokenSymbol}`;
        const key = {
          rewardToken: rewardToken,
          pool: poolAddress,
          startTime: startTime,
          endTime: startTime + endTime,
          refundee: refundee,
        };
        const sig = await generateSig(account.toLowerCase(), key);
        const arg = {
          poolName: poolName,
          poolAddress: poolAddress,
          rewardToken: rewardToken,
          account: account.toLowerCase(),
          incentiveKey: key,
          startTime: startTime,
          endTime: startTime + endTime,
          allocatedReward: allocatedReward.toString(),
          numStakers: 0,
          status: 'open',
          verified: true,
          tx: receipt,
          sig: sig,
        };
        const create = await createReward(arg);
        if (create.success === true) {
          fetchProjectsData()
        }
      }
    } catch (e) {
      console.log(e);

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

  const refundFunc = async (key: Key) => {
    if (account === null || account === undefined || library === undefined) {
      return;
    }
    const signer = getSigner(library, account);
    try {
      const receipt = await uniswapStakerContract
        .connect(signer)
        .endIncentive(key);
      store.dispatch(setTxPending({tx: true}));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, 'Reward');
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

  const getPaginatedData = () => {
    const startIndex = pageIndex * pageLimit - pageLimit;
    const endIndex = startIndex + pageLimit;
    return datas.slice(startIndex, endIndex);
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
                {(
                  (vault.vaultTokenAllocation / project.totalTokenAllocation) *
                  100
                )
                  .toString()
                  .match(/^\d+(?:\.\d{0,2})?/)}
                %
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
            borderBottom={themeDesign.border[colorMode]}>
            <Text w={'30%'} fontSize={'15px'}>
              Liquidity Rewards Program Listed
            </Text>
            {claimTime !== 0 ? (
              <Flex w={'70%'} alignItems={'center'} justifyContent={'flex-end'}>
                <Flex flexDirection={'column'} mr={'20px'} textAlign={'right'}>
                  <Text color={'#7e8993'}>
                    You can create rewards program on
                  </Text>
                  <Text fontSize={'14px'}>
                    {' '}
                    {moment.unix(claimTime).format('MMM. DD, yyyy HH:mm:ss')} (
                    {momentTZ.tz(momentTZ.tz.guess()).zoneAbbr()})
                  </Text>
                </Flex>
                <Button
                  bg={'#257eee'}
                  fontSize={'12px'}
                  height={'40px'}
                  width={'120px'}
                  padding={'6px 12px'}
                  whiteSpace={'normal'}
                  color={'#fff'}
                  isDisabled={distributeDisable || pool === zero_address || moment().unix() > duration[1]}
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
                  onClick={() =>
                    openAnyModal('Launch_CreateRewardProgram', {
                      createRewardFirst,
                      project,
                      distributable,
                      duration,
                    })
                  }>
                  Create Reward Program
                </Button>
              </Flex>
            ) : (
              <></>
            )}
          </GridItem>
          {getPaginatedData().map((reward: any, index: number) => {
            return (
              <GridItem
                fontFamily={theme.fonts.fld}
                className={'chart-cell'}
                justifyContent={'flex-start'}
                border={themeDesign.border[colorMode]}
                borderTop="none">
                <Text w={'17%'} fontSize={'18px'}>
                  #{reward.index}
                </Text>
                <Flex w={'40%'} flexDirection={'column'} mr={'50px'}>
                  <Text color={'#7e8993'}>Reward Duration</Text>
                  <Text>
                    {moment.unix(reward.startTime).format('yyyy.MM.DD HH:mm')} -{' '}
                    {moment.unix(reward.endTime).format('yyyy.MM.DD HH:mm')}
                  </Text>
                </Flex>
                <Flex w={'25%'} flexDirection={'column'} mr={'20px'}>
                  <Text color={'#7e8993'}>Refundable Amount</Text>
                  <Flex alignItems={'baseline'}>
                    <Text mr={'3px'} fontSize={'16px'}>
                      {Number(
                        ethers.utils.formatEther(reward.unclaimed),
                      ).toLocaleString()}
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
                  isDisabled={Number(reward.unclaimed) === 0}
                  _disabled={{
                    color: colorMode === 'light' ? '#86929d' : '#838383',
                    bg: colorMode === 'light' ? '#e9edf1' : '#353535',
                    cursor: 'not-allowed',
                  }}
                  _hover={
                    // I set !disableButton just for UI testing purposes. Revert to disableButton (or any condition) to disable _hover and _active styles.
                    Number(reward.unclaimed) === 0
                      ? {}
                      : {
                          background: 'transparent',
                          border: 'solid 1px #2a72e5',
                          color: themeDesign.tosFont[colorMode],
                          cursor: 'pointer',
                        }
                  }
                  _active={
                    Number(reward.unclaimed) === 0
                      ? {}
                      : {
                          background: '#2a72e5',
                          border: 'solid 1px #2a72e5',
                          color: '#fff',
                        }
                  }
                  onClick={() => refundFunc(reward.incentiveKey)}>
                  Refund
                </Button>
              </GridItem>
            );
          })}
          {[...Array(3 - getPaginatedData().length)].map((i: number) => {
            return (
              <GridItem
                fontFamily={theme.fonts.fld}
                className={'chart-cell'}
                border={themeDesign.border[colorMode]}
                borderTop="none"
                fontSize={'13px'}></GridItem>
            );
          })}
          <GridItem
            fontFamily={theme.fonts.fld}
            className={'chart-cell'}
            justifyContent={'center'}
            border={themeDesign.border[colorMode]}
            borderTop="none">
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
                    isDisabled={
                      pageIndex === pageOptions ||
                      getPaginatedData().length !== 3
                    }
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
