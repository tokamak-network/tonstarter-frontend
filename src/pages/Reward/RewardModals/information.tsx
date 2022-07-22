import {FC, useState, useEffect, useRef, useCallback} from 'react';
import {
  Text,
  Flex,
  Box,
  useTheme,
  useColorMode,
  Avatar,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Divider,
  Grid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Center,
  Tooltip,
  IconButton,
  Button,
  AccordionIcon,
} from '@chakra-ui/react';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {checkTokenType} from 'utils/token';
import {closeModal, selectModalType} from 'store/modal.reducer';
import moment from 'moment';
import {DEPLOYED} from 'constants/index';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {ethers} from 'ethers';
import {soliditySha3} from 'web3-utils';
import {fetchPositionRangePayloadModal} from '../utils/fetchPositionRangePayloads';
import {Scrollbars} from 'react-custom-scrollbars-2';
import {PieChart} from './../components/PieChart';
import {useWeb3React} from '@web3-react/core';
import {CloseButton} from 'components/Modal/CloseButton';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import {selectApp} from 'store/app/app.reducer';
import {LoadingComponent} from 'components/Loading';
import Web3 from 'web3';

const {
  WTON_ADDRESS,
  TON_ADDRESS,
  UniswapStaking_Address,
  TOS_ADDRESS,
  UniswapStaker_Address,
  BasePool_Address,
} = DEPLOYED;

export const InformationModal = () => {
  const {account, library} = useWeb3React();
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  const [refundableAmount, setRefundableAmount] = useState<any>();
  const [rewardStakersInfo, setRewardStakersInfo] = useState<any[]>([]);
  const [userStakerIds, setUserStakerIds] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pieData, setPieData] = useState<any[]>([]);
  const [recentActivityTable, setRecentActivityTable] = useState<any>();
  const {data: appConfig} = useAppSelector(selectApp);
  const [network, setNetwork] = useState<string>('');
  const [blockNumberFilter, setBlockNumberFilter] = useState<number>(5000);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(5);
  const [pageOptions, setPageOptions] = useState<number>(0);
  const [activityPageIndex, setActivityPageIndex] = useState<number>(1);
  const [activityPageLimit, setActivityPageLimit] = useState<number>(5);
  const [activityPageOptions, setActivityPageOptions] = useState<number>(0);
  const [accumulatedRewards, setAccumulatedRewards] = useState<string>('0');

  //@ts-ignore
  const web3 = new Web3(window.ethereum);
  //@ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const {reward, stakedPools, userAddress, key, positions, blockNumber,rewardSymbol} =
    data.data;
    
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

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const rangePayload = async (args: any) => {
    const {account, library, id} = args;
    const result = await fetchPositionRangePayloadModal(library, id, account, reward.poolAddress);

    return result;
  };

  useEffect(() => {
    if (key && userAddress && stakedPools && reward) {
      setLoading(true);
      getModalData(key, userAddress, stakedPools, positions, reward);
    }
  }, [data]);

  useEffect(() => {
    if (rewardStakersInfo) {
      const pagenumber = parseInt(
        ((rewardStakersInfo.length - 1) / pageLimit + 1).toString(),
      );
      setPageOptions(pagenumber);
    }
  }, [rewardStakersInfo]);

  useEffect(() => {
    if (recentActivityTable) {
      const pagenumber = parseInt(
        ((recentActivityTable.length - 1) / pageLimit + 1).toString(),
      );
      setActivityPageOptions(pagenumber);
    }
  }, [recentActivityTable]);

  const getModalData = async (
    key: any,
    userAddress: string,
    stakedPools: any,
    positions: any,
    reward: any,
  ) => {
    if (account === null || account === undefined || library === undefined) {
      return;
    }

    const uniswapStakerContract = new Contract(
      UniswapStaker_Address,
      STAKERABI.abi,
      library,
    );

    const tempNetwork = await provider.getNetwork();
    setNetwork(tempNetwork.name);

    const incentiveABI =
      'tuple(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)';
    const abicoder = ethers.utils.defaultAbiCoder;
    const incentiveId = soliditySha3(abicoder.encode([incentiveABI], [key]));
    const signer = getSigner(library, account);

    const incentiveInfo = await uniswapStakerContract
      .connect(signer)
      .incentives(incentiveId);

    const tokenStakedActivity = await uniswapStakerContract.queryFilter(
      uniswapStakerContract.filters.TokenStaked(null, incentiveId, null),
      blockNumber - blockNumberFilter,
      blockNumber,
    );

    const tokenUnstakedActivity = await uniswapStakerContract.queryFilter(
      uniswapStakerContract.filters.TokenUnstaked(null, incentiveId),
      blockNumber - blockNumberFilter,
      blockNumber,
    );

    const incentiveEndedActivity = await uniswapStakerContract.queryFilter(
      uniswapStakerContract.filters.IncentiveEnded(incentiveId, null),
      blockNumber - blockNumberFilter,
      blockNumber,
    );

    let incentiveCreatedActivity = await uniswapStakerContract.queryFilter(
      uniswapStakerContract.filters.IncentiveCreated(
        reward.rewardToken,
        reward.poolAddress,
      ),
      blockNumber - blockNumberFilter,
      blockNumber,
    );

    if (incentiveCreatedActivity[0] !== undefined) {
      //@ts-ignore
      const decodedData = incentiveCreatedActivity[0].decode(
        incentiveCreatedActivity[0].data,
        incentiveCreatedActivity[0].topics,
      );
      const dataObj = {
        endTime: Number(decodedData.endTime),
        pool: decodedData.pool,
        refundee: decodedData.refundee,
        rewardToken: decodedData.rewardToken,
        startTime: Number(decodedData.startTime),
      };
      if (JSON.stringify(dataObj) !== JSON.stringify(reward.incentiveKey)) {
        incentiveCreatedActivity = [];
      }
    }

    let stakerEvents = [
      tokenStakedActivity,
      tokenUnstakedActivity,
      incentiveCreatedActivity,
      incentiveEndedActivity,
    ].flat();

    if (stakerEvents) {
      const txnTableData = await Promise.all(
        stakerEvents.map(async (txn: any) => {
          // Add txnInfo to each 'activity'
          txn.formattedTxnDate = await convertDateFromBlockNumber(
            txn.blockNumber,
          );

          // Add unixTime to each 'activity'
          txn.unixTime = await getUnixFromBlockNumber(txn.blockNumber);

          txn.transactionInfo = await provider.getTransaction(
            txn.transactionHash,
          );
          txn.incentiveTxnReceiptInfo = await provider.getTransactionReceipt(
            txn.transactionHash,
          );

          txn.from = txn?.transactionInfo?.from;

          // Split camelCased event string.
          txn.event = txn.event.replace(/([a-z](?=[A-Z]))/g, '$1 ');

          return txn;
        }),
      );

      const sortedTxnTable = txnTableData.sort(
        (a, b) => b.unixTime - a.unixTime,
      );
      setRecentActivityTable(sortedTxnTable);
    }

    let userPositions = positions.map((position: any) => {
      return position.id;
    });

    let tempRewardStakerInfo: any[] = [];
    let tempRewardStakedIds: any[] = [];
    let tempPieData: any[] = [];
    await Promise.all(
      stakedPools.map(async (pool: any) => {
        const incentiveInfo = await uniswapStakerContract
          .connect(signer)
          .stakes(Number(pool.id), incentiveId);

        const depositInfo = await uniswapStakerContract
          .connect(signer)
          .deposits(Number(pool.id));

        if (incentiveInfo.liquidity._hex !== '0x00') {
          // Need to get rangeInfo for the Range column in All Staked LP Tokens table
          const rangeInfo: any = await rangePayload({
            account,
            library,
            id: pool.id,
          });

          tempRewardStakerInfo.push({
            inRange: rangeInfo?.range,
            tick: rangeInfo?.res?.tick,
            tickLower: rangeInfo?.res?.tickLower,
            tickUpper: rangeInfo?.res?.tickUpper,
            token: pool.id,
            token0Address: reward.token0Address,
            token1Address: reward.token1Address,
            liquidity: ethers.utils.formatEther(incentiveInfo.liquidity),
            ownerAddress: depositInfo.owner,
            stakeOwner: pool.owner,
            poolId: pool.pool.id,
          });
          tempRewardStakedIds.push({
            token: pool.id,
            token0Address: reward.token0Address,
            token1Address: reward.token1Address,
          });
          // Creating data that will be sent to pie chart.
          if (
            tempPieData.length > 0 &&
            tempPieData.some((data) => data.ownerAddress === depositInfo.owner)
          ) {
            let index = tempPieData.findIndex(
              (data: any) => data.ownerAddress === depositInfo.owner,
            );
            tempPieData[index].liquidity += Number(
              ethers.utils.formatEther(incentiveInfo.liquidity),
            );
          } else {
            tempPieData.push({
              ownerAddress: depositInfo.owner,
              liquidity: Number(
                ethers.utils.formatEther(incentiveInfo.liquidity),
              ),
            });
          }
        }
      }),
    ).then(() => {
      let totalLiquidty = 0;
      const calcPercentage = (partialValue: number, totalValue: number) => {
        return (100 * partialValue) / totalValue;
      };
      tempRewardStakerInfo.forEach((data: any) => {
        totalLiquidty += Number(data.liquidity);
      });
      const formattedData = tempRewardStakerInfo.map((data: any) => {
        return {
          id: data.token,
          token0Address: data.token0Address,
          token1Address: data.token1Address,
          liquidity: data.liquidity,
          liquidityPercentage: calcPercentage(
            Number(data.liquidity),
            totalLiquidty,
          ).toFixed(2),
          ownerAddress: data.ownerAddress,
          stakeOwner: data.stakeOwner,
          poolId: data.poolId,
          tick: data?.tick,
          tickLower: data?.tickLower,
          tickUpper: data?.tickUpper,
          inRange: data?.inRange,
        };
      });
      const formattedPieData = tempPieData.map((data: any) => {
        return {
          liquidity: data.liquidity,
          liquidityPercentage: calcPercentage(
            Number(data.liquidity),
            totalLiquidty,
          ).toFixed(2),
          ownerAddress: data.ownerAddress,
        };
      });
      formattedData.sort((a: any, b: any) =>
        Number(a.liquidity) < Number(b.liquidity) ? 1 : -1,
      );
      formattedPieData.sort((a: any, b: any) =>
        Number(a.liquidity) < Number(b.liquidity) ? 1 : -1,
      );

      // Add tokens owned to each position holder for pie data key.
      formattedData.forEach((token: any) => {
        formattedPieData.forEach((pieOwner: any) => {
          if (token.ownerAddress === pieOwner.ownerAddress) {
            if (pieOwner.tokensOwned) {
              pieOwner.tokensOwned.push(token.id);
            } else {
              pieOwner.tokensOwned = [token.id];
            }
          }
        });
      });

      tempRewardStakerInfo = formattedData;
      tempPieData = formattedPieData;
    });

    let filteredStakedPositions = tempRewardStakedIds.filter(
      (position: any) => {
        return userPositions.includes(position.token);
      },
    );

    const userStakedPositions = await positions.filter(
      (position: any) =>
        ethers.utils.getAddress(position.owner) !==
          ethers.utils.getAddress(userAddress) &&
        tempRewardStakerInfo.some((reward) => reward.id === position.id),
    );

    if (userStakedPositions.length > 0) {
      let accumulatedRewardsInProgram = 0;
      await Promise.all(
        userStakedPositions.map(async (position: any) => {
          const mapInfo = await uniswapStakerContract
            .connect(signer)
            .getRewardInfo(key, Number(position.id));

          accumulatedRewardsInProgram +=
            ethers.utils.getAddress(reward.rewardToken) ===
            ethers.utils.getAddress(WTON_ADDRESS)
              ? Number(ethers.utils.formatUnits(mapInfo.reward, '27'))
              : Number(ethers.utils.formatEther(mapInfo.reward));
        }),
      );

      const formattedAccumulatedReward =
        accumulatedRewardsInProgram < 0.01
          ? '<0.01'
          : accumulatedRewardsInProgram.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            });

      setAccumulatedRewards(formattedAccumulatedReward);
    } else {
      setAccumulatedRewards('0');
    }

    setLoading(false);
    setPieData(tempPieData);

    // tempRewardStakerInfo is the data for the All Staked LP Tokens table
    setRewardStakersInfo(tempRewardStakerInfo);

    setUserStakerIds(filteredStakedPositions);

    setRefundableAmount(
      incentiveInfo.totalRewardUnclaimed.toLocaleString('fullwide', {
        useGrouping: false,
      }),
    );
  };

  const getTotalDuration = (startTime: any, endTime: any) => {
    let unixStartTime = moment.unix(startTime);
    let unixEndTime = moment.unix(endTime);
    let diff = unixEndTime.diff(unixStartTime);
    let duration = moment.duration(diff);
    let formattedHoursMinutesSeconds = moment.utc(diff).format('HH:mm:ss');

    let days = Math.floor(duration.asDays());
    duration.subtract(moment.duration(days, 'days'));

    return `${days}D ${formattedHoursMinutesSeconds}`;
  };

  const formatNumberWithCommas = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatAmount = (amount: any, token: any) => {
    // Double check DOC address. Refundable amount seems broken.
    if (token && amount) {
      let formattedAmt =
        ethers.utils.getAddress(token) === ethers.utils.getAddress(WTON_ADDRESS)
          ? Number(ethers.utils.formatUnits(amount, 27)).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 0,
              },
            )
          : Number(ethers.utils.formatEther(amount.toString())).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 0,
              },
            );
      if (formattedAmt.includes(',')) {
        const removeCommaString = formattedAmt.replaceAll(',', '');
        formattedAmt = removeCommaString;
      }
      const removeDecimalAmt = Number(
        Math.floor(Number(formattedAmt)).toFixed(0),
      );
      const finalFormattedString = formatNumberWithCommas(removeDecimalAmt);
      return finalFormattedString;
    } else if (amount && !token) {
      let formattedAmt = Number(
        ethers.utils.formatEther(amount.toString()),
      ).toLocaleString(undefined, {
        minimumFractionDigits: 0,
      });
      if (formattedAmt.includes(',')) {
        const removeCommaString = formattedAmt.replace(',', '');
        formattedAmt = removeCommaString;
      }
      const removeDecimalAmt = Number(
        Math.floor(Number(formattedAmt)).toFixed(0),
      );
      const finalFormattedString = formatNumberWithCommas(removeDecimalAmt);
      return finalFormattedString;
    }
  };

  const shortenAddress = (address: string) => {
    let firstStr = address.substring(0, 4);
    let lastStr = address.substring(address.length - 4, address.length);
    let combined = `${firstStr}...${lastStr}`;
    return combined;
  };

  const getUnixFromBlockNumber = async (blockNumber: number) => {
    let unixTime = await web3.eth.getBlock(blockNumber).then((res) => {
      return res.timestamp;
    });

    return unixTime;
  };

  const convertDateFromBlockNumber = (blockNumber: number) => {
    let formattedDate = web3.eth
      .getBlock(blockNumber)
      .then((res) =>
        moment.unix(Number(res.timestamp)).format('MM/DD/YYYY HH:MM:ss'),
      );

    return formattedDate;
  };

  const getPaginatedData = () => {
    const startIndex = pageIndex * pageLimit - pageLimit;
    const endIndex = startIndex + pageLimit;
    return rewardStakersInfo.slice(startIndex, endIndex);
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

  const getPaginatedActivityData = () => {
    const startIndex =
      activityPageIndex * activityPageLimit - activityPageLimit;
    const endIndex = startIndex + activityPageLimit;
    return recentActivityTable.slice(startIndex, endIndex);
  };

  const goToNextActivityPage = () => {
    setActivityPageIndex(activityPageIndex + 1);
  };

  const gotToPreviousActivityPage = () => {
    setActivityPageIndex(activityPageIndex - 1);
  };

  const changeActivityPage = (pageNumber: number) => {
    setActivityPageIndex(pageNumber);
    getPaginationGroup();
  };

  if (!reward || !recentActivityTable) {
    return <></>;
  }
  return !loading ? (
    <Modal
      isOpen={data.modal === 'information' ? true : false}
      onClose={handleCloseModal}
      size={'6xl'}>
      <ModalOverlay />
      <ModalContent
        height={'85vh'}
        fontFamily={theme.fonts.fld}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}>
        <CloseButton closeFunc={handleCloseModal} />
        <Scrollbars
          style={{
            width: '100%',
            display: 'flex',
            position: 'absolute',
          }}
          thumbSize={70}
          //renderThumbVertical / horizontal is where you change scrollbar styles.
          renderThumbVertical={() => <div style={{background: '#007aff'}} />}>
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            mt={'10px'}>
            <Avatar
              src={reward.token0Image}
              bg={colorMode === 'light' ? '#ffffff' : '#222222'}
              name="T"
              border={
                colorMode === 'light'
                  ? '1px solid #e7edf3'
                  : '1px solid #3c3c3c'
              }
              h="50px"
              w="50px"
              zIndex={'100'}
            />
            <Avatar
              src={reward.token1Image}
              bg={colorMode === 'light' ? '#ffffff' : '#222222'}
              name="T"
              h="50px"
              border={
                colorMode === 'light'
                  ? '1px solid #e7edf3'
                  : '1px solid #3c3c3c'
              }
              w="50px"
              ml={'-7px'}
            />
            <Flex
              alignItems={'baseline'}
              fontWeight={'bold'}
              fontSize={'28px'}
              ml={'10px'}>
              <Text mr={'5px'}>#{reward.index}</Text>
              <Text>{reward.poolName}</Text>
            </Flex>
          </Box>
          <Divider my={'10px'} />

          <ModalBody>
            <Grid templateColumns={'repeat(7, 1fr)'} px="5px" gap={'12px'}>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                <Text color={themeDesign.font[colorMode]}>Total Reward</Text>
                <Flex
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'baseline'}>
                  <Text fontSize={'20px'} mr={'5px'}>
                    {formatAmount(reward.allocatedReward, reward.rewardToken)}{' '}
                  </Text>
                  <Text fontSize={'16px'}>
                    {
                     rewardSymbol
                    }
                  </Text>
                </Flex>
              </Box>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                <Text color={themeDesign.font[colorMode]} textAlign={'center'}>
                  Accumulated Rewards
                </Text>
                <Flex
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'baseline'}>
                  <Text fontSize={'20px'} mr={'5px'}>
                    {accumulatedRewards}{' '}
                  </Text>
                  <Text fontSize={'16px'}>
                  {
                     rewardSymbol
                    }
                  </Text>
                </Flex>
              </Box>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                <Text color={themeDesign.font[colorMode]}>Reward Period</Text>
                <Flex flexDirection={'column'} alignItems={'center'}>
                  <Text fontSize={'12px'}>
                    {moment
                      .unix(Number(reward.startTime))
                      .format('YYYY.MM.DD HH:MM:ss')}
                  </Text>
                  <Text fontSize={'12px'}>
                    -{' '}
                    {moment
                      .unix(Number(reward.endTime))
                      .format('YYYY.MM.DD HH:MM:ss')}
                  </Text>
                </Flex>
              </Box>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                <Text color={themeDesign.font[colorMode]}>Total Duration</Text>
                <Text fontSize={'20px'}>
                  {getTotalDuration(reward.startTime, reward.endTime)}
                </Text>
              </Box>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                <Text color={themeDesign.font[colorMode]}>
                  Number of Stakers
                </Text>
                <Text fontSize={'20px'}>{pieData.length}</Text>
                {/* <Text fontSize={'20px'}>{reward.numStakers}</Text> */}
              </Box>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                <Text color={themeDesign.font[colorMode]}>Status</Text>
                <Text fontSize={'20px'}>
                  {reward.status === 'open' && reward.endTime > moment().unix()
                    ? reward.status.charAt(0).toUpperCase() +
                      reward.status.slice(1)
                    : 'Closed'}
                </Text>
              </Box>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                <Text color={themeDesign.font[colorMode]}>
                  Refundable Amount
                </Text>
                <Flex
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'baseline'}>
                  <Text fontSize={'20px'} mr={'5px'}>
                    {formatAmount(refundableAmount, reward.rewardToken)}{' '}
                  </Text>
                  <Text fontSize={'16px'}>
                  {
                     rewardSymbol
                    }
                  </Text>
                </Flex>
              </Box>
            </Grid>

            <Divider my={'15px'} />

            {rewardStakersInfo?.length > 0 ? (
              <>
                {userStakerIds?.length > 0 ? (
                  <>
                    <Box display={'flex'}>
                      <Box width={'30%'}>
                        <Text fontFamily={theme.fonts.titil}>
                          Increase liquidity of your LP tokens staked in this
                          reward program
                        </Text>
                      </Box>
                      <Box
                        width={'70%'}
                        display={'flex'}
                        alignItems={'center'}
                        overflowX={'auto'}>
                        {userStakerIds?.map((token: any, index: any) => {
                          return (
                            <Flex
                              key={index}
                              onClick={() =>
                                window.open(
                                  `https://app.uniswap.org/#/increase/${
                                    token.token0Address
                                  }/${token.token1Address}/3000/${token.token}${
                                    network === 'rinkeby'
                                      ? '?chain=rinkeby'
                                      : ''
                                  }`,
                                )
                              }
                              h="30px"
                              px={'15px'}
                              mx={'7px'}
                              // style={{color: 'blue.500'}}
                              fontSize={'13px'}
                              fontFamily={theme.fonts.roboto}
                              fontWeight={'bold'}
                              border="1px"
                              borderColor={
                                colorMode === 'light' ? '#e7edf3' : '#535353'
                              }
                              borderRadius="19px"
                              color="blue.500"
                              justifyContent={'center'}
                              alignItems={'center'}
                              _hover={{
                                cursor: 'pointer',
                                background: 'blue.500',
                                color: 'white',
                                border: 'none',
                              }}>
                              <Text>#{token.token}</Text>
                            </Flex>
                          );
                        })}
                      </Box>
                    </Box>

                    <Divider my={'15px'} />
                  </>
                ) : null}
                <Heading
                  fontSize={'1.2em'}
                  fontWeight={'extrabold'}
                  fontFamily={theme.fonts.titil}
                  mb={'15px'}
                  color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                  LP Composition
                </Heading>

                <Box display={'flex'}>
                  <Box w={'50%'} display={'flex'} flexDirection={'column'}>
                    <Heading
                      fontSize={'1em'}
                      fontFamily={theme.fonts.titil}
                      mb={'15px'}
                      color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                      Major Players
                    </Heading>
                    <Flex height={'250px'}>
                      <PieChart pieData={pieData} />
                    </Flex>
                  </Box>
                  <Box w={'50%'} display={'flex'} flexDirection={'column'}>
                    <Heading
                      fontSize={'1em'}
                      fontFamily={theme.fonts.titil}
                      mb={'15px'}
                      color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                      All Staked LP Tokens
                    </Heading>

                    <Table>
                      <Thead>
                        <Tr
                          borderBottom={themeDesign.border[colorMode]}
                          display={'flex'}>
                          <Th
                            width={'33%'}
                            borderBottom={'none'}
                            textAlign={'center'}>
                            LP Token
                          </Th>
                          <Th
                            width={'33%'}
                            borderBottom={'none'}
                            textAlign={'center'}>
                            Range
                          </Th>
                          <Th
                            width={'33%'}
                            borderBottom={'none'}
                            textAlign={'center'}>
                            Percentage
                          </Th>
                        </Tr>
                      </Thead>

                      <Tbody w={'100%'} height={'224px'}>
                        {getPaginatedData().map((info: any) => {
                          return (
                            <Tr
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderBottom: themeDesign.border[colorMode],
                              }}>
                              <Td
                                width={'33%'}
                                style={{
                                  padding: '12px 24px',
                                  borderBottom: 'none',
                                  textAlign: 'center',
                                }}>
                                <Link
                                  isExternal
                                  _hover={{
                                    color: 'blue.500',
                                  }}
                                  href={`https://app.uniswap.org/#/pool/${
                                    info.id
                                  }${
                                    network === 'rinkeby'
                                      ? '?chain=rinkeby'
                                      : ''
                                  }`}>
                                  {info.id}
                                </Link>
                              </Td>
                              <Td
                                width={'33%'}
                                style={{
                                  padding: '12px 24px',
                                  borderBottom: 'none',
                                  textAlign: 'center',
                                }}>
                                {info.inRange ? 'In Range' : 'Out of Range'}
                              </Td>
                              <Td
                                width={'33%'}
                                isNumeric
                                style={{
                                  padding: '12px 24px',
                                  borderBottom: 'none',
                                  textAlign: 'center',
                                }}>
                                {Number(info.liquidityPercentage) === 0.1
                                  ? '< 0.10'
                                  : info.liquidityPercentage}
                                %
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                      <Flex
                        flexDirection={'row'}
                        pb="10px"
                        justifyContent={'center'}
                        pt="19px"
                        mx="15px">
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
                              color={
                                colorMode === 'light' ? '#e6eaee' : '#424242'
                              }
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
                                color:
                                  colorMode === 'light' ? '#3e495c' : '#2a72e5',
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
                                      : themeDesign.buttonColorInactive[
                                          colorMode
                                        ]
                                  }
                                  p="0px"
                                  _hover={{
                                    background: 'transparent',
                                    color:
                                      themeDesign.buttonColorActive[colorMode],
                                  }}
                                  _active={{background: 'transparent'}}
                                  disabled={pageOptions < groupIndex}
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
                              color={
                                colorMode === 'light' ? '#e6eaee' : '#424242'
                              }
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
                                color:
                                  colorMode === 'light' ? '#3e495c' : '#2a72e5',
                              }}
                              icon={<ChevronRightIcon h={6} w={6} />}
                            />
                          </Tooltip>
                        </Flex>
                      </Flex>
                    </Table>
                  </Box>
                </Box>
              </>
            ) : (
              <Flex justifyContent={'center'}>No Staker Info to Show...</Flex>
            )}
            <Divider my={'15px'} />

            {getPaginatedActivityData().length < 1 ? (
              <Flex justifyContent={'center'}>
                No Recent Activity within the last {blockNumberFilter} blocks.
              </Flex>
            ) : (
              <>
                <Heading
                  fontSize={'1em'}
                  fontWeight={'extrabold'}
                  fontFamily={theme.fonts.titil}
                  mb={'15px'}
                  color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                  Recent Activity
                </Heading>
                <Table overflowY={'auto'} maxHeight={'200px'}>
                  <Thead>
                    <Tr
                      borderBottom={themeDesign.border[colorMode]}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Th
                        width={'20%'}
                        borderBottom={'none'}
                        textAlign={'center'}>
                        Account Address
                      </Th>
                      <Th
                        width={'20%'}
                        borderBottom={'none'}
                        textAlign={'center'}>
                        TX hash
                      </Th>
                      <Th
                        width={'20%'}
                        borderBottom={'none'}
                        textAlign={'center'}>
                        Type
                      </Th>
                      <Th
                        width={'20%'}
                        borderBottom={'none'}
                        textAlign={'center'}>
                        Amount
                      </Th>
                      <Th
                        width={'20%'}
                        borderBottom={'none'}
                        textAlign={'center'}>
                        Date
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {getPaginatedActivityData().map((txn: any) => {
                      return (
                        <Tr
                          style={{
                            borderBottom: themeDesign.border[colorMode],
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Td width={'20%'} textAlign={'center'}>
                            <Link
                              isExternal
                              _hover={{
                                color: 'blue.500',
                              }}
                              href={`${appConfig.explorerLink}${txn.transactionInfo.from}`}>
                              {shortenAddress(txn.transactionInfo.from)}
                            </Link>
                          </Td>
                          <Td width={'20%'} textAlign={'center'}>
                            <Link
                              isExternal
                              _hover={{
                                color: 'blue.500',
                              }}
                              href={`${appConfig.explorerTxnLink}${txn.transactionHash}`}>
                              {shortenAddress(txn.transactionHash)}
                            </Link>
                          </Td>
                          <Td width={'20%'} textAlign={'center'}>
                            {txn.event}
                          </Td>
                          {txn.event === 'Incentive Created' ? (
                            <Td width={'20%'} textAlign={'center'}>
                              {formatAmount(txn.args.reward.toString(), null)}
                            </Td>
                          ) : txn.event === 'Incentive Ended' ? (
                            <Td width={'20%'} textAlign={'center'}>
                              {formatAmount(txn.args.refund.toString(), null)}
                            </Td>
                          ) : (
                            <Td width={'20%'} textAlign={'center'}>
                              -
                            </Td>
                          )}
                          <Td width={'20%'} textAlign={'center'}>
                            {txn.formattedTxnDate}
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                <Flex
                  flexDirection={'row'}
                  pb="10px"
                  justifyContent={'center'}
                  pt="19px"
                  mx="15px">
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
                        onClick={gotToPreviousActivityPage}
                        isDisabled={activityPageIndex === 1}
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
                      (groupActivityIndex: number, index: number) => {
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
                              activityPageIndex === groupActivityIndex
                                ? themeDesign.buttonColorActive[colorMode]
                                : themeDesign.buttonColorInactive[colorMode]
                            }
                            p="0px"
                            _hover={{
                              background: 'transparent',
                              color: themeDesign.buttonColorActive[colorMode],
                            }}
                            _active={{background: 'transparent'}}
                            disabled={activityPageOptions < groupActivityIndex}
                            onClick={() =>
                              changeActivityPage(groupActivityIndex)
                            }>
                            {groupActivityIndex}
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
                        onClick={goToNextActivityPage}
                        isDisabled={activityPageIndex === activityPageOptions}
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
              </>
            )}
          </ModalBody>
        </Scrollbars>
      </ModalContent>
    </Modal>
  ) : (
    <Modal
      isOpen={data.modal === 'information' ? true : false}
      onClose={handleCloseModal}
      size={'6xl'}>
      <ModalOverlay />
      <ModalContent
        height={'85vh'}
        fontFamily={theme.fonts.fld}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}>
        <Flex
          pos="absolute"
          w="100%"
          h="100%"
          alignItems="center"
          justifyContent="center"
          pb={25}
          zIndex={100}>
          <Center w="100%" h="100%">
            <LoadingComponent></LoadingComponent>
          </Center>
        </Flex>{' '}
      </ModalContent>
    </Modal>
  );
};