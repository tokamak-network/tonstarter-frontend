import {FC, useState, useMemo, useEffect, useRef, useCallback} from 'react';
import {
  Text,
  Flex,
  Box,
  useTheme,
  useColorMode,
  Avatar,
  Image,
  Tooltip,
  Checkbox,
  Button,
  Progress,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Divider,
  Grid,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {checkTokenType} from 'utils/token';
import {selectTransactionType} from 'store/refetch.reducer';
import {closeModal, selectModalType, openModal} from 'store/modal.reducer';
import {useActiveWeb3React} from 'hooks/useWeb3';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import moment from 'moment';
import {DEPLOYED} from 'constants/index';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as NPMABI from 'services/abis/NonfungiblePositionManager.json';
import {approveStaking, stake, unstake} from '../actions';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import {utils, ethers} from 'ethers';
import {soliditySha3} from 'web3-utils';
import {getTokenSymbol} from '../utils/getTokenSymbol';
import {UpdatedRedward} from '../types';
import {LPToken} from '../types';
import {convertNumber} from 'utils/number';
import {Scrollbars} from 'react-custom-scrollbars-2';
import {PieChart} from './../components/PieChart';
import {useWeb3React} from '@web3-react/core';
import {CloseButton} from 'components/Modal/CloseButton';
import {useGraphQueries} from 'hooks/useGraphQueries';
import {gql, useQuery} from '@apollo/client';
import {usePoolByArrayQuery} from 'store/data/generated';
const {
  WTON_ADDRESS,
  TON_ADDRESS,
  UniswapStaking_Address,
  TOS_ADDRESS,
  UniswapStaker_Address,
} = DEPLOYED;

export const InformationModal = () => {
  const {account, library} = useWeb3React();
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  const [address, setAddress] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [decimal, setDecimal] = useState<number>(0);
  const [validAddress, setValidAddress] = useState<boolean>(false);
  const focusTarget = useRef<any>([]);
  const [tokenLists, setTokenLists] = useState<any[]>([]);
  const [tokenInfo, setTokenInfo] = useState<(string | number)[]>([]);
  const [balance, setBalance] = useState(0);
  const [remainingTime, setRemainingTime] = useState<any>();
  const [reward, setReward] = useState<any>();
  const [refundableAmount, setRefundableAmount] = useState<any>();
  const [rewardStakersInfo, setRewardStakersInfo] = useState<any[]>([]);
  const [userStakerIds, setUserStakerIds] = useState<any[]>([]);
  const [userAddress, setUserAddress] = useState<string>('');
  const [key, setKey] = useState<any>();
  const [stakedPools, setStakedPools] = useState<any>();
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pieData, setPieData] = useState<any[]>([]);

  // const [isHandling, setIsHandling] = useState<boolean>(true);

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  // console.log(data?.data?.currentReward?.poolAddress);

  // const GET_POOL_DATA = gql`
  //   query poolByArray($address: [${
  //     data?.data?.currentReward?.poolAddress || undefined
  //   }]) {
  //     pools(first: 1000, where: {id_in: $address}) {
  //       id
  //     }
  //   }
  // `;

  const queryData = usePoolByArrayQuery(
    {
      address: data?.data?.currentReward?.poolAddress,
    },
    // {
    //   pollingInterval: ms`2s`,
    // },
  );
  // console.log('queryLodaing: ', queryLodaing);
  // console.log('queryData: ', queryData);

  useEffect(() => {
    const {
      currentReward,
      currentStakedPools,
      currentUserAddress,
      currentKey,
      currentPositions,
    } = data.data;
    console.log('DATA: ', data.data);

    setReward(currentReward);
    setUserAddress(currentUserAddress);
    setKey(currentKey);
    setStakedPools(currentStakedPools);
    setPositions(currentPositions);

    // getPoolInfo(key.poolAddress);
    // useQueryFunc(key.poolAddress);

    if (key && userAddress && stakedPools && reward) {
      getIncentives(key, userAddress, stakedPools, positions);
      testCall(positions, key);
    }
    if (reward && userAddress && key && positions) {
      setLoading(false);
    }

    if (currentPositions) {
      // axios
      //   .get(
      //     `https://rinkeby.etherscan.io/address/${currentReward.rewardToken}`,
      //   )
      //   .then((res) => console.log(res.data));
      getStatus(currentPositions);
    }

    // }
    // }
    // fetchData();
    /*eslint-disable*/
  }, [data, reward]);

  const getStatus = (token: any) => {
    // console.log('token: ', token);
    token.map((tok: any) => {
      const liquidity = Number(
        ethers.utils.formatEther(tok.liquidity.toString()),
      );
      // if (liquidity > 0 && token.range) {
      //   return 'openIn';
      // } else if (liquidity > 0 && !token.range) {
      //   return 'openOut';
      // } else if (liquidity === 0 && token.range) {
      //   return 'closedIn';
      // } else {
      //   return 'closedOut';
      // }
      // console.log('liquidity: ', liquidity);
    });
  };

  const getIncentives = async (
    key: any,
    userAddress: string,
    stakedPools: any,
    positions: any,
  ) => {
    if (account === null || account === undefined || library === undefined) {
      return;
    }
    const uniswapStakerContract = new Contract(
      UniswapStaker_Address,
      STAKERABI.abi,
      library,
    );

    let userPositions = positions.map((position: any) => {
      return position.id;
    });

    const incentiveABI =
      'tuple(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)';
    const abicoder = ethers.utils.defaultAbiCoder;
    const incentiveId = soliditySha3(abicoder.encode([incentiveABI], [key]));
    const signer = getSigner(library, account);
    const incentiveInfo = await uniswapStakerContract
      .connect(signer)
      .incentives(incentiveId);

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
          tempRewardStakerInfo.push({
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

      tempRewardStakerInfo = formattedData;
      tempPieData = formattedPieData;
    });

    let filteredStakedPositions = tempRewardStakedIds.filter(
      (position: any) => {
        return userPositions.includes(position.token);
      },
    );

    // console.log('rewardStakersInfo: ', tempRewardStakerInfo);
    setPieData(tempPieData);
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

  const formatAmount = (amount: any, token: any) => {
    // Double check DOC address. Refundable amount seems broken.
    if (token && amount) {
      return ethers.utils.getAddress(token) ===
        ethers.utils.getAddress(WTON_ADDRESS)
        ? Number(ethers.utils.formatUnits(amount, 27)).toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
            },
          )
        : Number(ethers.utils.formatEther(amount.toString())).toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
            },
          );
    }
  };

  const testCall = async (positions: any, key: any) => {
    // console.log('positions: ', positions);
    // console.log('library: ', library);
    // console.log('account: ', account);
    if (account) {
      const uniswapStakerContract = new Contract(
        UniswapStaker_Address,
        STAKERABI.abi,
        library,
      );
      // console.log('address: ', UniswapStaker_Address);
      // console.log('contract: ', uniswapStakerContract);

      //@ts-ignore
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // console.log('provider: ', provider);

      // const logs = provider.getLogs({
      //   address: address,
      //   // topics: [“0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef”]
      // });

      // const filterTo = uniswapStakerContract.filters.Transfer(null, address);
      // console.log('filterTo: ', filterTo);

      const signer = getSigner(library, account);
      let deposit = await uniswapStakerContract
        .connect(signer)
        .deposits(Number(positions[0].id));
      // console.log('deposit: ', deposit);
    }
  };

  // url for adding liquidity to tokens: https://app.uniswap.org/#/increase/0x73a54e5C054aA64C1AE7373C2B5474d8AFEa08bd/0xb109f4c20BDb494A63E32aA035257fBA0a4610A4/3000/13035?chain=rinkeby

  if (!reward) {
    return <></>;
  }
  return !loading ? (
    <Modal
      isOpen={data.modal === 'information' ? true : false}
      onClose={handleCloseModal}
      size={'6xl'}>
      {console.log('reward: ', reward)}

      <ModalOverlay />
      <ModalContent
        height={'85vh'}
        overflowY={'auto'}
        overflowX={'hidden'}
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}>
        <Scrollbars
          style={{
            width: '100%',
            display: 'flex',
            position: 'absolute',
          }}
          thumbSize={70}
          //renderThumbVertical / horizontal is where you change scrollbar styles.
          renderThumbVertical={() => <div style={{background: '#fff'}}></div>}>
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
            <Text fontWeight={'bold'} fontSize={'22px'} ml={'10px'}>
              {reward.poolName}
            </Text>
          </Box>
          <Divider my={'10px'} />
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}></Box>

          <CloseButton closeFunc={handleCloseModal}></CloseButton>
          <ModalBody>
            <Grid templateColumns={'repeat(7, 1fr)'} px="5px" gap={'12px'}>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                <Text>Total Reward</Text>
                <Text>
                  {formatAmount(reward.allocatedReward, reward.rewardToken)}{' '}
                  {
                    checkTokenType(
                      ethers.utils.getAddress(reward.rewardToken),
                      colorMode,
                    ).name
                  }
                </Text>
              </Box>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                <Text>Accumulated LP</Text>
                <Text>
                  {formatAmount(reward.allocatedReward, reward.rewardToken)}{' '}
                  {
                    checkTokenType(
                      ethers.utils.getAddress(reward.rewardToken),
                      colorMode,
                    ).name
                  }
                </Text>
              </Box>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                <Text>Reward Period</Text>
                <Flex flexDirection={'column'}>
                  <Text fontSize={'12px'}>
                    {moment.unix(Number(reward.startTime)).format('YYYY.MM.DD')}
                  </Text>
                  <Text fontSize={'12px'}>
                    - {moment.unix(Number(reward.endTime)).format('YYYY.MM.DD')}
                  </Text>
                </Flex>
              </Box>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                <Text>Total Duration</Text>
                <Text>
                  {getTotalDuration(reward.startTime, reward.endTime)}
                </Text>
              </Box>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                <Text>Number of Stakers</Text>
                <Text>{rewardStakersInfo.length}</Text>
                {/* <Text>{reward.numStakers}</Text> */}
              </Box>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                <Text>Status</Text>
                {/* This is always open. Something is wrong. */}
                <Text>
                  {reward.status.charAt(0).toUpperCase() +
                    reward.status.slice(1)}
                </Text>
              </Box>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                <Text>Refundable Amount</Text>
                <Text>
                  {formatAmount(refundableAmount, reward.rewardToken)}{' '}
                  {
                    checkTokenType(
                      ethers.utils.getAddress(reward.rewardToken),
                      colorMode,
                    ).name
                  }
                </Text>
              </Box>
            </Grid>

            <Divider my={'15px'} />

            <Box display={'flex'}>
              <Box width={'30%'}>
                <Text fontFamily={theme.fonts.titil}>
                  Increase liquidity of your LP tokens staked in this reward
                  program
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
                          `https://app.uniswap.org/#/increase/${token.token0Address}/${token.token1Address}/3000/${token.token}?chain=rinkeby`,
                        )
                      }
                      background={'blue.500'}
                      h="30px"
                      px={'15px'}
                      mx={'7px'}
                      fontSize={'13px'}
                      fontFamily={theme.fonts.roboto}
                      fontWeight={'bold'}
                      borderRadius="19px"
                      justifyContent={'center'}
                      alignItems={'center'}
                      _hover={{cursor: 'pointer'}}>
                      <Text color={'white.100'}>{token.token}</Text>
                    </Flex>
                  );
                })}
              </Box>
            </Box>

            <Divider my={'15px'} />

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
                  <Flex height={'250px'}>
                    <PieChart pieData={pieData} />
                  </Flex>
                </Heading>
              </Box>
              <Box
                w={'50%'}
                display={'flex'}
                flexDirection={'column'}
                position={'relative'}>
                <Box overflowY="auto" maxHeight="300px">
                  <Scrollbars
                    style={{
                      width: '100%',
                      display: 'flex',
                      position: 'absolute',
                    }}
                    thumbSize={70}
                    //renderThumbVertical / horizontal is where you change scrollbar styles.
                    renderThumbVertical={() => (
                      <div style={{background: '#fff'}}></div>
                    )}>
                    <Heading
                      fontSize={'1em'}
                      fontFamily={theme.fonts.titil}
                      mb={'15px'}
                      color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                      All Staked LP Tokens
                    </Heading>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>LP Token</Th>
                          <Th>Range</Th>
                          <Th isNumeric>Percentage</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {rewardStakersInfo.map((info: any) => {
                          return (
                            <Tr>
                              <Td>{info.id}</Td>
                              <Td>true</Td>
                              <Td isNumeric>
                                {Number(info.liquidityPercentage) === 0.1
                                  ? '< 0.10'
                                  : info.liquidityPercentage}
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </Scrollbars>
                </Box>
              </Box>
            </Box>

            <Divider my={'15px'} />

            <Heading
              fontSize={'1em'}
              fontWeight={'extrabold'}
              fontFamily={theme.fonts.titil}
              mb={'15px'}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
              Recent Activity
            </Heading>

            <Table>
              <Thead>
                <Tr>
                  <Th>Account Address</Th>
                  <Th>TX hash</Th>
                  <Th>Type</Th>
                  <Th>Amount</Th>
                  <Th>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>inches</Td>
                  <Td>yards</Td>
                  <Td>yards</Td>
                  <Td>millimetres (mm)</Td>
                  <Td>25.4</Td>
                </Tr>
                <Tr>
                  <Td>feet</Td>
                  <Td>yards</Td>
                  <Td>yards</Td>
                  <Td>centimetres (cm)</Td>
                  <Td>30.48</Td>
                </Tr>
                <Tr>
                  <Td>yards</Td>
                  <Td>yards</Td>
                  <Td>yards</Td>
                  <Td>metres (m)</Td>
                  <Td>0.91444</Td>
                </Tr>
                <Tr>
                  <Td>yards</Td>
                  <Td>yards</Td>
                  <Td>yards</Td>
                  <Td>metres (m)</Td>
                  <Td>0.91444</Td>
                </Tr>
              </Tbody>
            </Table>
          </ModalBody>

          {/* <Divider /> */}

          {/* <ModalFooter display={'flex'} justifyContent={'center'}>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleCloseModal}
            color={'white'}>
            Refund
          </Button>
        </ModalFooter> */}
        </Scrollbars>
      </ModalContent>
    </Modal>
  ) : null;
};