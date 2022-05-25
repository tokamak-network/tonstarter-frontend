import {
  Container,
  Box,
  Text,
  Flex,
  Center,
  useColorMode,
  FormControl,
  FormLabel,
  useTheme,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  Button,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
  Switch,
  Stack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import {Fragment, useEffect, useState} from 'react';
import {Head} from 'components/SEO';
import {SearchModal} from './RewardModals';
import {PageHeader} from 'components/PageHeader';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {ManageContainer} from './ManageContainer';
import {RewardContainer} from './RewardContainer';
// import {selectRewards} from './reward.reducer';
import {useAppSelector} from 'hooks/useRedux';
import {selectTransactionType} from 'store/refetch.reducer';
// import {usePoolByUserQuery} from 'store/data/enhanced';
import {DEPLOYED} from '../../constants/index';
import ms from 'ms.macro';
import {Contract} from '@ethersproject/contracts';
import {LoadingComponent} from 'components/Loading';
import {orderBy} from 'lodash';
// import * as StakeUniswapABI from 'services/abis/StakeUniswapV3.json';
import {getSigner} from 'utils/contract';
// import {getPoolName, checkTokenType} from '../../utils/token';
// import {fetchPositionPayload} from '../Pools/utils/fetchPositionPayload';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import {ChevronDownIcon, ChevronRightIcon} from '@chakra-ui/icons';
import {utils, ethers} from 'ethers';
import {incentiveKey, Token, interfaceReward, LPToken} from './types';
import {fetchPositionRangePayload} from './utils/fetchPositionRangePayloads';
import {InformationModal} from '../Reward/RewardModals/information';

import moment from 'moment';
import views from './rewards';
import {getTokenSymbol} from './utils/getTokenSymbol';
import {
  usePositionByUserQuery,
  usePositionByPoolQuery,
  usePoolByArrayQuery,
} from 'store/data/generated';
import {SideContainer} from './SideContainer';
const {
  UniswapStaker_Address,
  WTON_ADDRESS,
  TOS_ADDRESS,
} = DEPLOYED;

type Pool = {
  feeTier: string;
  id: string;
  liquidity: string;
  hourData: [];
  tick: string;
  token0: Token;
  token1: Token;
  token0Image: string;
  token1Image: string;
};

const themeDesign = {
  border: {
    light: 'solid 1px #dfe4ee',
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
};
export const Reward = () => {
  // const {datas, loading} = useAppSelector(selectRewards);
  const [datas, setDatas] = useState<interfaceReward[] | []>([]);
  const theme = useTheme();
  const {REWARD_STYLE} = theme;
  const {MENU_STYLE} = theme;
  const {colorMode} = useColorMode();
  const {account, library} = useActiveWeb3React();
  const [selectedPool, setSelectedPool] = useState<Pool>();
  const [selectdPosition, setSelectdPosition] = useState<LPToken>();
  const [selected, setSelected] = useState('reward');
  const [pool, setPool] = useState<any[]>([]);
  // const [stakingPosition, setStakingPosition] = useState([]);
  const [poolsFromAPI, setPoolsFromAPI] = useState<any>([]);
  const [manageDatas, setManageDatas] = useState<interfaceReward[]>([]);
  const [isPositionLoading, setIsPositionLoading] = useState(true);
  const [sortString, setSortString] = useState<string>('Latest');
  const [poolAddresses, setPoolAddresses] = useState<string[]>([]);
  // const {
  //   data: {timeStamp, func},
  // } = useAppSelector(selectTransactionType);
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const [orderedData, setOrderedData] = useState<interfaceReward[]>([]);
  const [order, setOrder] = useState<boolean | 'desc' | 'asc'>('asc');
  const [tokenList, setTokenList] = useState<any[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token>();
  const [filteredData, setFilteredData] = useState<interfaceReward[]>([]);
  const [filteredManageData, setFilteredManageData] = useState<
    interfaceReward[]
  >([]);
  const [selectedPoolCreate, setSelectedPoolCreated] = useState<Pool>();
  const [positions, setPositions] = useState<any[]>([]);
  const [selectedTokenType, setSelectedTokenType] = useState<string>('');

  // const arr: any = [];
  useEffect(() => {
    setSelectdPosition(undefined);
  }, [account, library]);
  useEffect(() => {
    async function fetchProjectsData() {
      const poolsData: any = await views.getPoolData(library);
      const rewardData = await views.getRewardData();
      setPoolsFromAPI(poolsData);
      const poolArray: any = [];
      if (poolsData) {
        poolsData.map((pool: any) => {
          poolArray.push(pool.poolAddress.toLowerCase());
        });
      }

      if (rewardData) {
        rewardData.map((reward, index) => {
          reward.index = index + 1;
        });

        setDatas(rewardData);
      }
      setPoolAddresses(poolArray);
    }
    fetchProjectsData();
  }, [account, library, selected]);

  const poolArr = usePoolByArrayQuery(
    {address: poolAddresses},
    {
      pollingInterval: ms`2s`,
    },
  );

  const positionsByPool = usePositionByPoolQuery(
    {pool_id: poolAddresses},
    {
      pollingInterval: 2000,
    },
  );

  useEffect(() => {
    const filteredData = filterDatas();
    setOrderedData(filteredData);
    setFilteredData(filteredData);
  }, [sortString, datas]);

  const changeSelect = (e: any) => {
    const filterValue = e.target.value;
    order === 'desc' ? setOrder('asc') : setOrder('desc');
    setSortString(filterValue);
  };

  const filterDatas = () => {
    const now = moment().unix();
    switch (sortString) {
      case 'Start Date':
        return orderBy(datas, (data) => data.startTime, [order]);
      case 'End Date':
        return orderBy(datas, (data) => data.endTime, [order]);
      case 'Started':
        const inProgress = datas.filter(
          (data) => now > data.startTime && now < data.endTime,
        );
        return inProgress;
      case 'Closed':
        const closed = datas.filter((data) => now > data.endTime);
        return closed;
      case 'Waiting':
        const waiting = datas.filter((data) => now < data.startTime);
        return waiting;
      case 'Latest':
        return datas.reverse();
      case 'Oldest':
        return datas.reverse();
      default:
        return datas.reverse();
    }
  };

  useEffect(() => {
    const addPoolsInfo = () => {
      const pols = poolArr.data?.pools;
      if (pols !== undefined) {
        const poooools = pols.map((data: any) => {
          const APIPool = poolsFromAPI.find(
            (pol: any) => ethers.utils.getAddress(pol.poolAddress) === ethers.utils.getAddress(data.id),
          );
          const token0Image = APIPool.token0Image;
          const token1Image = APIPool.token1Image;
          return {
            ...data,
            token0Image: token0Image,
            token1Image: token1Image,
          };
        });
        setPool(poooools);
      }
    };
    addPoolsInfo();
  }, [account, transactionType, blockNumber, poolArr]);

  const position = usePositionByUserQuery(
    {address: account},
    {
      pollingInterval: 2000,
    },
  );
  const getStatus = (token: any) => {
    if (token) {
      const liquidity = Number(
        ethers.utils.formatEther(token.liquidity.toString()),
      );
      if (liquidity > 0 && token.range) {
        return 'openIn';
      } else if (liquidity > 0 && !token.range) {
        return 'openOut';
      } else if (liquidity === 0 && token.range) {
        return 'closedIn';
      } else {
        return 'closedOut';
      }
    }
  };

  useEffect(() => {
    async function getPosition() {
      const uniswapStakerContract = new Contract(
        UniswapStaker_Address,
        STAKERABI.abi,
        library,
      );
      async function getRangedData(stringResult: any) {
        const res = await Promise.all(
          stringResult.map(async (data: any) => {
            const includedPool = pool.find(
              (pol: any) =>
                ethers.utils.getAddress(pol.id) ===
                ethers.utils.getAddress(data.pool.id),
            );
            if (includedPool) {
              const rang = await getRange(Number(data.id), includedPool.tick);
              return {
                ...data,
                range: rang?.range,
                liquidity: rang?.res.liquidity,
              };
            }
          }),
        );
        const closedIn = res.filter(
          (token: any) => getStatus(token) === 'closedIn',
        );
        const closedOut = res.filter(
          (token: any) => getStatus(token) === 'closedOut',
        );

        const openIn = res.filter(
          (token: any) => getStatus(token) === 'openIn',
        );
        const openOut = res.filter(
          (token: any) => getStatus(token) === 'openOut',
        );

        const openInOrdered = orderBy(openIn, (data: any) => Number(data.id), [
          'desc',
        ]);
        const openOutOrdered = orderBy(
          openOut,
          (data: any) => Number(data.id),
          ['desc'],
        );

        const closedInOrdered = orderBy(
          closedIn,
          (data: any) => Number(data.id),
          ['desc'],
        );
        const closedOutOrdered = orderBy(
          closedOut,
          (data: any) => Number(data.id),
          ['desc'],
        );

        const open = openInOrdered.concat(openOutOrdered);
        const close = closedInOrdered.concat(closedOutOrdered);
        const tokenList = open.concat(close);
        setPositions(tokenList);
      }
      if (position.data && positionsByPool.data) {
        position.refetch();

        if (
          selectedPool !== undefined &&
          account !== undefined &&
          account !== null
        ) {
          const withStakedPosition = position.data.positions.filter(
            (position: any) => selectedPool.id === position.pool.id,
          );
          const pols = positionsByPool.data.positions.filter(
            (position: any) =>
              ethers.utils.getAddress(position.owner) ===
                ethers.utils.getAddress(UniswapStaker_Address.toLowerCase()) ||
              ethers.utils.getAddress(position.owner) ===
                ethers.utils.getAddress(account),
          );
          const poolsFromSelected = pols.filter(
            (token: any) => token.pool.id === selectedPool.id,
          );
          if (
            account === null ||
            account === undefined ||
            library === undefined
          ) {
            return;
          }
          const signer = getSigner(library, account);
          let stringResult: any = [];

          await Promise.all(
            poolsFromSelected.map(async (token: any) => {
              const depositInfo = await uniswapStakerContract
                .connect(signer)
                .deposits(token.id);

              if (depositInfo.owner === account) {
                stringResult.push(token);
              }
            }),
          );

          const allPos = withStakedPosition.concat(stringResult);
          await getRangedData(allPos);
          setTimeout(() => {
            setIsPositionLoading(false);
          }, 1500);
        } else if (
          selectedPool === undefined &&
          account !== undefined &&
          account !== null
        ) {
          let stringResult: any = [];
          pool.map((pool: any) => {
            const filtered = position.data.positions.filter(
              (position: any) => position.pool.id === pool.id,
            );
            filtered.map((filteredPosition: any) => {
              stringResult.push(filteredPosition);
            });
          });
          const pols = positionsByPool.data.positions.filter(
            (position: any) =>
              ethers.utils.getAddress(position.owner) ===
                ethers.utils.getAddress(UniswapStaker_Address.toLowerCase()) ||
              ethers.utils.getAddress(position.owner) ===
                ethers.utils.getAddress(account),
          );
          if (
            account === null ||
            account === undefined ||
            library === undefined
          ) {
            return;
          }
          const signer = getSigner(library, account);

          await Promise.all(
            pols.map(async (token: any) => {
              const depositInfo = await uniswapStakerContract
                .connect(signer)
                .deposits(token.id);

              if (depositInfo.owner === account) {
                stringResult.push(token);
              }
            }),
          );

          await getRangedData(stringResult);

          setTimeout(() => {
            setIsPositionLoading(false);
          }, 1500);
        } else {
          setTimeout(() => {
            setIsPositionLoading(false);
          }, 1500);
          setSelectdPosition(undefined);
        }
      }
    }
    getPosition();
    /*eslint-disable*/
  }, [
    datas,
    pool,
    selectedPool,
    transactionType,
    blockNumber,
    positionsByPool.isLoading,
    positionsByPool.data,
    position.isLoading,
    position.data,
    account,
    library,
    orderedData,
  ]);

  const getRange = async (id: number, tick: string) => {
    const result = await rangePayload({library, id, account, tick});
    return result;
  };
  const rangePayload = async (args: any) => {
    const {library, id, tick} = args;
    if (account === undefined || library === undefined || account == null) {
      return;
    }
    const result = await fetchPositionRangePayload(library, id, account, tick);
    return result;
  };

  useEffect(() => {
    if (account !== undefined && account !== null) {
      const filtered = orderedData.filter(
        (data) =>
          ethers.utils.getAddress(data.incentiveKey.refundee) ===
          ethers.utils.getAddress(account),
      );
      setManageDatas(filtered);
      setFilteredManageData(filtered);
    }
  }, [orderedData, sortString, account, library]);

  const getSelectedPool = (e: any) => {
    const poolAddress = e.target.value;
    console.log(poolAddress);
    console.log(pool);
    
    const selected: Pool = pool.find((pool) => ethers.utils.getAddress(pool.id) === ethers.utils.getAddress(poolAddress));
    console.log('selected',selected);
    
    setSelectedPool(selected);
    setSelectedToken(undefined);
    setSelectdPosition(undefined);
    setSelectedPoolCreated(selected);
    setSelectedTokenType('All');
    if (poolAddress === '') {
      setOrderedData(datas);
      setFilteredData(datas);
      setSelectdPosition(undefined);
    } else {
      const selectedRewards = datas.filter(
        (data) => ethers.utils.getAddress(data.poolAddress) === ethers.utils.getAddress(poolAddress),
      );
      setOrderedData(selectedRewards);
      setFilteredData(selectedRewards);
    }
  };

  const getSelectedReardToken = (e: any) => {
    const tokenAddress = e.target.value;
    const rewardToken: Token = tokenList.find(
      (token) => token.token === tokenAddress,
    );
    setSelectedToken(rewardToken);

    if (tokenAddress !== '') {
      const selectedManageRewards = manageDatas.filter(
        (data: any) =>
          ethers.utils.getAddress(data.rewardToken.toString()) ===
          ethers.utils.getAddress(tokenAddress),
      );
      setFilteredManageData(selectedManageRewards);
      if (orderedData.length === 0) {
        const selectedRewards = datas.filter(
          (data) =>
            ethers.utils.getAddress(data.rewardToken.toString()) ===
            ethers.utils.getAddress(tokenAddress),
        );
        setFilteredData(selectedRewards);
      } else {
        const selectedRewards = orderedData.filter(
          (data) =>
            ethers.utils.getAddress(data.rewardToken.toString()) ===
            ethers.utils.getAddress(tokenAddress),
        );
        setFilteredData(selectedRewards);
      }
    } else {
      setFilteredData(datas);
      setFilteredManageData(manageDatas);
    }
  };
  const getSelectedPosition = (e: any) => {
    const pos = e.target.value;
    const selectedLP: any = positions.find((position) => position.id === pos);
    setSelectdPosition(selectedLP);
  };
  const getTokenFromContract = async (address: string) => {
    const symbolContract = await getTokenSymbol(address, library);
    return symbolContract;
  };

  useEffect(() => {
    const getTokenList = async () => {
      const rewardTokens = [
        ...Array.from(
          new Set(
            datas.map((reward: any) =>
              ethers.utils.getAddress(reward.rewardToken),
            ),
          ),
        ),
      ];

      let tokensArray: any = [];
      await Promise.all(
        rewardTokens.map(async (token) => {
          const symbol = await getTokenFromContract(token);
          tokensArray.push({
            symbol,
            token,
          });
        }),
      );
      setTokenList(tokensArray);
    };
    getTokenList();
  }, [datas, account, library, transactionType, blockNumber]);

  return (
    <Fragment>
      <Head title={'Reward'} />
      <Container maxW={'6xl'}>
        <Box py={20}>
          <PageHeader
            title={'Rewards Program'}
            subtitle={'Stake Uniswap V3 liquidity tokens and receive rewards! '}
          />
        </Box>
        {isPositionLoading !== true &&
        account !== undefined &&
        pool.length !== 0 ? (
          <Box>
            <Flex
              fontFamily={theme.fonts.roboto}
              flexDir={'row'}
              justifyContent={'space-between'}>
              <Flex alignItems={'center'}>
                <Menu isLazy>
                  <MenuButton
                    border={themeDesign.border[colorMode]}
                    {...MENU_STYLE.buttonStyle({colorMode})}>
                    <Text {...MENU_STYLE.buttonTextStyle({colorMode})}>
                      {selectedPool === undefined
                        ? 'All Pools'
                        : `${selectedPool.token0.symbol} / ${
                            selectedPool.token1.symbol
                          }    (${parseInt(selectedPool.feeTier) / 10000} %) `}
                      <span>
                        <ChevronDownIcon />
                      </span>
                    </Text>
                  </MenuButton>
                  <MenuList {...MENU_STYLE.menuListStyle({colorMode})}>
                    <MenuItem
                      onClick={getSelectedPool}
                      value={''}
                      {...MENU_STYLE.menuItemStyle({colorMode})}>
                      All pools
                    </MenuItem>
                    {pool.map((item, index) => (
                      <MenuItem
                        onClick={getSelectedPool}
                        value={item.id}
                        {...MENU_STYLE.menuItemStyle({colorMode})}
                        key={index}>
                        {`${item.token0.symbol} / ${item.token1.symbol}    (${
                          parseInt(item.feeTier) / 10000
                        } %) `}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <Menu isLazy>
                  <MenuButton
                    border={themeDesign.border[colorMode]}
                    {...MENU_STYLE.buttonStyle({colorMode})}>
                    <Text {...MENU_STYLE.buttonTextStyle({colorMode})}>
                      {selectedToken === undefined
                        ? 'Reward Tokens'
                        : selectedToken.symbol}
                      <span>
                        <ChevronDownIcon />
                      </span>
                    </Text>
                  </MenuButton>
                  <MenuList {...MENU_STYLE.menuListStyle({colorMode})}>
                    <MenuItem
                      onClick={getSelectedReardToken}
                      value={''}
                      {...MENU_STYLE.menuItemStyle({colorMode})}>
                      All reward tokens
                    </MenuItem>
                    {tokenList.map((item, index) => (
                      <MenuItem
                        onClick={getSelectedReardToken}
                        value={item.token}
                        {...MENU_STYLE.menuItemStyle({colorMode})}
                        key={index}>
                        {item.symbol}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                {/* <Button border={'2px solid #2a72e5'} bg={'transparent'} _hover={{bg:'none'}} _active={{bg:'none'}}
                    {...MENU_STYLE.buttonStyle({colorMode})}></Button> */}
                <Menu isLazy>
                  <MenuButton
                    border={'2px solid #2a72e5'}
                    {...MENU_STYLE.buttonStyle({colorMode})}>
                    <Text {...MENU_STYLE.buttonTextStyle({colorMode})}>
                      {selectdPosition === undefined
                        ? 'My LP tokens'
                        : selectdPosition.id}
                      <span>
                        <ChevronDownIcon />
                      </span>
                    </Text>
                  </MenuButton>
                  <MenuList {...MENU_STYLE.menuListStyle({colorMode})}>
                    <MenuItem>
                      <Menu isLazy>
                        {({isOpen}) => (
                          <>
                            <MenuButton
                              minWidth={'90px'}
                              textAlign={'left'}
                              fontSize={'13px'}
                              onClick={() => {
                                setSelectedTokenType('All');
                              }}>
                              All{' '}
                              {isOpen ? (
                                <ChevronRightIcon />
                              ) : (
                                <ChevronDownIcon />
                              )}
                            </MenuButton>

                            <MenuList
                              zIndex={10000}
                              ml={'-0.845rem'}
                              mr={'1px'}
                              minWidth="155px"
                              borderTop="none"
                              boxShadow="none"
                              borderTopRadius={0}
                              minHeight={'80px'}
                              background={
                                colorMode === 'light' ? '#ffffff' : '#222222'
                              }>
                              {positions.map((item: any, index) => {
                                const status = getStatus(item);
                                return (
                                  <MenuItem
                                    onClick={getSelectedPosition}
                                    // onClick={() => alert("Kagebunshin")}
                                    h={'30px'}
                                    color={
                                      status === 'openOut' ||
                                      status === 'closedOut'
                                        ? '#ff7800'
                                        : colorMode === 'light'
                                        ? '#3e495c'
                                        : '#f3f4f1'
                                    }
                                    fontSize={'12px'}
                                    w={'154px'}
                                    m={'0px'}
                                    value={item.id}
                                    _hover={{
                                      background: 'transparent',
                                      color: 'blue.100',
                                    }}
                                    textDecoration={
                                      status === 'closedIn' ||
                                      status === 'closedOut'
                                        ? 'line-through'
                                        : 'none'
                                    }
                                    _focus={{background: 'transparent'}}
                                    key={index}>
                                    {item.id}{' '}
                                    <Text ml={'8px'} fontSize={'9px'}>
                                      {' '}
                                      {item.pool.token0.symbol} /{' '}
                                      {item.pool.token1.symbol}
                                    </Text>
                                  </MenuItem>
                                );
                              })}
                            </MenuList>
                          </>
                        )}
                      </Menu>
                    </MenuItem>
                    <MenuItem>
                      <Menu isLazy>
                        {({isOpen}) => (
                          <>
                            <MenuButton
                              minWidth={'90px'}
                              textAlign={'left'}
                              fontSize={'13px'}
                              onClick={() => {
                                setSelectedTokenType('Staked');
                              }}>
                              Staked{' '}
                              {isOpen ? (
                                <ChevronRightIcon />
                              ) : (
                                <ChevronDownIcon />
                              )}
                            </MenuButton>

                            <MenuList
                              zIndex={10000}
                              minHeight={'50px'}
                              ml={'-0.845rem'}
                              mr={'1px'}
                              minWidth="156px"
                              borderTop="none"
                              boxShadow="none"
                              borderTopRadius={0}
                              background={
                                colorMode === 'light' ? '#ffffff' : '#222222'
                              }>
                              {positions.map((item: any, index) => {
                                if (item.owner !== account?.toLowerCase()) {
                                  const status = getStatus(item);
                                  return (
                                    <MenuItem
                                      onClick={getSelectedPosition}
                                      // onClick={() => alert("Kagebunshin")}
                                      h={'30px'}
                                      color={
                                        status === 'openOut' ||
                                        status === 'closedOut'
                                          ? '#ff7800'
                                          : colorMode === 'light'
                                          ? '#3e495c'
                                          : '#f3f4f1'
                                      }
                                      fontSize={'12px'}
                                      w={'153px'}
                                      m={'0px'}
                                      value={item.id}
                                      _hover={{
                                        background: 'transparent',
                                        color: 'blue.100',
                                      }}
                                      textDecoration={
                                        status === 'closedIn' ||
                                        status === 'closedOut'
                                          ? 'line-through'
                                          : 'none'
                                      }
                                      _focus={{background: 'transparent'}}
                                      key={index}>
                                      {item.id}{' '}
                                      <Text ml={'8px'} fontSize={'9px'}>
                                        {' '}
                                        {item.pool.token0.symbol} /{' '}
                                        {item.pool.token1.symbol}
                                      </Text>
                                    </MenuItem>
                                  );
                                }
                              })}
                            </MenuList>
                          </>
                        )}
                      </Menu>
                    </MenuItem>
                    <MenuItem>
                      <Menu isLazy>
                        {({isOpen}) => (
                          <>
                            <MenuButton
                              minWidth={'90px'}
                              textAlign={'left'}
                              fontSize={'13px'}
                              onClick={() => {
                                setSelectedTokenType('Not Staked');
                              }}>
                              Not Staked{' '}
                              {isOpen ? (
                                <ChevronRightIcon />
                              ) : (
                                <ChevronDownIcon />
                              )}
                            </MenuButton>
                            <MenuList
                              zIndex={10000}
                              ml={'-0.845rem'}
                              mr={'1px'}
                              minHeight={'100%'}
                              minWidth="156px"
                              borderTop="none"
                              boxShadow="none"
                              borderTopRadius={0}
                              background={
                                colorMode === 'light' ? '#ffffff' : '#222222'
                              }>
                              {positions.map((item: any, index) => {
                                const status = getStatus(item);

                                if (item.owner === account?.toLowerCase()) {
                                  return (
                                    <MenuItem
                                      onClick={getSelectedPosition}
                                      h={'30px'}
                                      color={
                                        status === 'openOut' ||
                                        status === 'closedOut'
                                          ? '#ff7800'
                                          : colorMode === 'light'
                                          ? '#3e495c'
                                          : '#f3f4f1'
                                      }
                                      fontSize={'12px'}
                                      w={'9.5rem'}
                                      m={'0px'}
                                      textDecoration={
                                        status === 'closedIn' ||
                                        status === 'closedOut'
                                          ? 'line-through'
                                          : 'none'
                                      }
                                      value={item.id}
                                      _hover={{
                                        background: 'transparent',
                                        color: 'blue.100',
                                      }}
                                      _focus={{background: 'transparent'}}
                                      key={index}>
                                      {item.id}{' '}
                                      <Text ml={'8px'} fontSize={'9px'}>
                                        {' '}
                                        {item.pool.token0.symbol} /{' '}
                                        {item.pool.token1.symbol}
                                      </Text>
                                    </MenuItem>
                                  );
                                }
                              })}
                            </MenuList>
                          </>
                        )}
                      </Menu>
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Menu isLazy>
                  <MenuButton
                    border={themeDesign.border[colorMode]}
                    {...MENU_STYLE.buttonStyle({colorMode})}
                    minWidth="120px">
                    <Text {...MENU_STYLE.buttonTextStyle({colorMode})}>
                      {sortString}
                      <span>
                        <ChevronDownIcon />
                      </span>
                    </Text>
                  </MenuButton>
                  <MenuList
                    {...MENU_STYLE.menuListStyle({colorMode})}
                    minWidth="155px">
                    <MenuItem
                      onClick={changeSelect}
                      {...MENU_STYLE.menuItemStyle({colorMode})}
                      value={'Latest'}
                      w="155px">
                      Latest
                    </MenuItem>
                    <MenuItem
                      onClick={changeSelect}
                      {...MENU_STYLE.menuItemStyle({colorMode})}
                      value={'Oldest'}
                      w="155px">
                      Oldest
                    </MenuItem>
                    <MenuItem
                      onClick={changeSelect}
                      {...MENU_STYLE.menuItemStyle({colorMode})}
                      value={'Start Date'}
                      w="155px">
                      Start Date
                    </MenuItem>
                    <MenuItem
                      onClick={changeSelect}
                      {...MENU_STYLE.menuItemStyle({colorMode})}
                      value={'End Date'}
                      w="155px">
                      End Date
                    </MenuItem>
                    <MenuItem
                      onClick={changeSelect}
                      {...MENU_STYLE.menuItemStyle({colorMode})}
                      value={'Started'}
                      w="155px">
                      Started
                    </MenuItem>
                    <MenuItem
                      onClick={changeSelect}
                      {...MENU_STYLE.menuItemStyle({colorMode})}
                      value={'Closed'}
                      w="155px">
                      Closed
                    </MenuItem>
                    <MenuItem
                      onClick={changeSelect}
                      {...MENU_STYLE.menuItemStyle({colorMode})}
                      value={'Waiting'}
                      w="155px">
                      Waiting
                    </MenuItem>
                  </MenuList>
                </Menu>
                {selected === 'reward' ? (
                  <Text
                    textDecoration={'underline'}
                    pl={'20px'}
                    cursor={'pointer'}
                    color={'#0070ed'}
                    fontSize={'13px'}
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(
                        selectedPool === undefined
                          ? `https://app.uniswap.org/#/add/${TOS_ADDRESS}/${WTON_ADDRESS}`
                          : `https://app.uniswap.org/#/add/${selectedPool.token0.id}/${selectedPool.token1.id}/${selectedPool.feeTier}`,
                      );
                    }}>
                    Create your{' '}
                    {selectedPool === undefined
                      ? ''
                      : `${selectedPool.token0.symbol} / ${selectedPool.token1.symbol}`}{' '}
                    liquidity tokens here
                  </Text>
                ) : (
                  <Text
                    textDecoration={'underline'}
                    pl={'20px'}
                    cursor={'pointer'}
                    color={'#0070ed'}
                    fontSize={'13px'}
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(
                        selectedPoolCreate === undefined
                          ? `https://app.uniswap.org/#/add/${TOS_ADDRESS}/${WTON_ADDRESS}`
                          : `https://app.uniswap.org/#/add/${selectedPoolCreate.token0.id}/${selectedPoolCreate.token1.id}/${selectedPoolCreate.feeTier}`,
                      );
                    }}>
                    Create your{' '}
                    {selectedPoolCreate === undefined
                      ? ''
                      : `${selectedPoolCreate.token0.symbol} / ${selectedPoolCreate.token1.symbol}`}{' '}
                    liquidity tokens here
                  </Text>
                )}
              </Flex>
              <Flex>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="email-alerts" mb="0">
                    Manage
                  </FormLabel>
                  <Switch
                    colorScheme={'green'}
                    onChange={() =>
                      selected === 'reward'
                        ? setSelected('manage')
                        : setSelected('reward')
                    }
                  />
                </FormControl>
              </Flex>
            </Flex>
            <Flex flexDir={'row'} mt={'30px'} justifyContent={'space-between'}>
              {selected === 'reward' ? (
                <Box>
                  <Flex
                    {...REWARD_STYLE.containerStyle({colorMode})}
                    h={'auto'}
                    w={'810px'}
                    mb={'20px '}
                    mr={'30px'}
                    pb={'6px'}
                    flexDir={'column'}>
                    <Text fontSize={'16px'} mb={'14px'} fontWeight={'bold'}>
                      Please select the LP tokens you want to control:{' '}
                      {selectedPool === undefined
                        ? 'All Pools'
                        : `${selectedPool.token0.symbol}/${
                            selectedPool.token1.symbol
                          }    (${parseInt(selectedPool.feeTier) / 10000} %)`}
                      , {selectedTokenType} {'Tokens'}
                    </Text>

                    <Flex direction="row" flexWrap={'wrap'}>
                      {selectedTokenType === 'All'
                        ? positions.map((item: any, index) => {
                            const status = getStatus(item);
                            return (
                              <Radio
                                value={item.id}
                                pr={'25px'}
                                fontSize={'14px'}
                                isChecked={
                                  Number(selectdPosition?.id) ===
                                  Number(item.id)
                                }
                                pb={'14px'}
                                onChange={getSelectedPosition}>
                                <Flex alignItems={'baseline'}>
                                  <Text
                                    color={
                                      status === 'openOut' ||
                                      status === 'closedOut'
                                        ? '#ff7800'
                                        : colorMode === 'light'
                                        ? '#3e495c'
                                        : '#f3f4f1'
                                    }
                                    textDecoration={
                                      status === 'closedIn' ||
                                      status === 'closedOut'
                                        ? 'line-through'
                                        : 'none'
                                    }>
                                    {item.id}
                                  </Text>
                                  <Text
                                    ml={'3px'}
                                    color={
                                      status === 'openOut' ||
                                      status === 'closedOut'
                                        ? '#ff7800'
                                        : colorMode === 'light'
                                        ? '#3e495c'
                                        : '#f3f4f1'
                                    }
                                    textDecoration={
                                      status === 'closedIn' ||
                                      status === 'closedOut'
                                        ? 'line-through'
                                        : 'none'
                                    }
                                    fontSize={'11px'}>
                                    {' '}
                                    {item.pool.token0.symbol} /{' '}
                                    {item.pool.token1.symbol}
                                  </Text>
                                </Flex>
                              </Radio>
                            );
                          })
                        : selectedTokenType === 'Staked'
                        ? positions.map((item: any, index) => {
                            if (item.owner !== account?.toLowerCase()) {
                              const status = getStatus(item);
                              return (
                                <Radio
                                  value={item.id}
                                  pr={'25px'}
                                  fontSize={'14px'}
                                  isChecked={
                                    Number(selectdPosition?.id) ===
                                    Number(item.id)
                                  }
                                  pb={'14px'}
                                  onChange={getSelectedPosition}>
                                  <Flex alignItems={'baseline'}>
                                    <Text
                                      color={
                                        status === 'openOut' ||
                                        status === 'closedOut'
                                          ? '#ff7800'
                                          : colorMode === 'light'
                                          ? '#3e495c'
                                          : '#f3f4f1'
                                      }
                                      textDecoration={
                                        status === 'closedIn' ||
                                        status === 'closedOut'
                                          ? 'line-through'
                                          : 'none'
                                      }>
                                      {item.id}
                                    </Text>
                                    <Text
                                      ml={'3px'}
                                      color={
                                        status === 'openOut' ||
                                        status === 'closedOut'
                                          ? '#ff7800'
                                          : colorMode === 'light'
                                          ? '#3e495c'
                                          : '#f3f4f1'
                                      }
                                      textDecoration={
                                        status === 'closedIn' ||
                                        status === 'closedOut'
                                          ? 'line-through'
                                          : 'none'
                                      }
                                      fontSize={'11px'}>
                                      {item.pool.token0.symbol} /{' '}
                                      {item.pool.token1.symbol}
                                    </Text>
                                  </Flex>
                                </Radio>
                              );
                            }
                          })
                        : selectedTokenType === 'Not Staked'
                        ? positions.map((item: any, index) => {
                            const status = getStatus(item);
                            if (item.owner === account?.toLowerCase()) {
                              return (
                                <Radio
                                  value={item.id}
                                  pr={'25px'}
                                  fontSize={'14px'}
                                  isChecked={
                                    Number(selectdPosition?.id) ===
                                    Number(item.id)
                                  }
                                  pb={'14px'}
                                  onChange={getSelectedPosition}>
                                  <Flex alignItems={'baseline'}>
                                    <Text
                                      color={
                                        status === 'openOut' ||
                                        status === 'closedOut'
                                          ? '#ff7800'
                                          : colorMode === 'light'
                                          ? '#3e495c'
                                          : '#f3f4f1'
                                      }
                                      textDecoration={
                                        status === 'closedIn' ||
                                        status === 'closedOut'
                                          ? 'line-through'
                                          : 'none'
                                      }>
                                      {item.id}
                                    </Text>
                                    <Text
                                      ml={'3px'}
                                      color={
                                        status === 'openOut' ||
                                        status === 'closedOut'
                                          ? '#ff7800'
                                          : colorMode === 'light'
                                          ? '#3e495c'
                                          : '#f3f4f1'
                                      }
                                      textDecoration={
                                        status === 'closedIn' ||
                                        status === 'closedOut'
                                          ? 'line-through'
                                          : 'none'
                                      }
                                      fontSize={'11px'}>
                                      {item.pool.token0.symbol} /{' '}
                                      {item.pool.token1.symbol}
                                    </Text>
                                  </Flex>
                                </Radio>
                              );
                            }
                          })
                        : null}
                    </Flex>
                  </Flex>
                  <RewardContainer
                    rewards={filteredData}
                    position={selectdPosition}
                    selectedPool={selectedPool}
                    pools={pool}
                    sortString={sortString}
                    positionsByPool={positionsByPool}
                    LPTokens={positions}
                  />
                </Box>
              ) : (
                <ManageContainer
                  rewards={filteredManageData}
                  position={selectdPosition}
                  selectedPool={selectedPool}
                  pools={pool}
                  sortString={sortString}
                  positionsByPool={positionsByPool}
                  LPTokens={positions}
                />
              )}
              <SideContainer
                pools={pool}
                selected={selected}
                rewards={datas}
                LPTokens={positions}
                setSelectedPoolCreated={setSelectedPoolCreated}
              />{' '}
            </Flex>
          </Box>
        ) : (
          <Center>
            <LoadingComponent />
          </Center>
        )}
      </Container>
      <SearchModal />
      <InformationModal />
    </Fragment>
  );
};
