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
const {UniswapStaker_Address, WTON_ADDRESS, TOS_ADDRESS} = DEPLOYED;

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
  const [tokensFromAPI, setTokensFromAPI] = useState<any[]>([]);

  //When the account address changes or network changes, set the loaded data to undefined 1st
  useEffect(() => {
    setSelectdPosition(undefined);
  }, [account, library]);

  //fetch the data from the API when the address, network or selected state changes
  useEffect(() => {
    async function fetchProjectsData() {
      const poolsData: any = await views.getPoolData(library); //get the pools data from pools API
      const tokens = await views.getTokensData(); //get the tokens deployed from tokens API
      const rewardData = await views.getRewardData(); //get the rewards from the rewards API
      setPoolsFromAPI(poolsData); // will be used later to fetch more pools data from the contracts

      const poolArray: any = []; //an array with just the addresses of all the pools from the api
      if (poolsData) {
        poolsData.map((pool: any) => {
          poolArray.push(pool.poolAddress.toLowerCase());
        });
      }

      if (rewardData) {
        rewardData.map((reward, index) => {
          reward.index = index + 1;
        });

        setDatas(rewardData); //adds the index to the rewards data
      }
      if (tokens) {
        setTokensFromAPI(tokens); //save the tokens to local state
      }
      setPoolAddresses(poolArray);
    }
    fetchProjectsData();
  }, [account, library, selected]);

  //get all the pool information using the pool addresses array
  const poolArr = usePoolByArrayQuery(
    {address: poolAddresses},
    {
      pollingInterval: ms`2s`,
    },
  );

  //get all the reward programs for each pool using the pool addresses array
  const positionsByPool = usePositionByPoolQuery(
    {pool_id: poolAddresses},
    {
      pollingInterval: 2000,
    },
  );

  //set ordered reward programs and filtered reward programs initially
  useEffect(() => {
    const filteredData = filterDatas();
    setOrderedData(filteredData);
    setFilteredData(filteredData);
  }, [sortString, datas]);

  //function for the onChange of sort menu. Set the sortString value to the menuitem value
  const changeSelect = (e: any) => {
    const filterValue = e.target.value;
    order === 'desc' ? setOrder('asc') : setOrder('desc');
    setSortString(filterValue);
  };

  //sort the data by the sortString value
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

  //using the pools data from graphql, and the data from the pools API, create a new array of pools data with the pool's token information
  useEffect(() => {
    const addPoolsInfo = () => {
      const pols = poolArr.data?.pools;
      if (pols !== undefined) {
        const poooools = pols.map((data: any) => {
          const APIPool = poolsFromAPI.find(
            (pol: any) =>
              ethers.utils.getAddress(pol.poolAddress) ===
              ethers.utils.getAddress(data.id),
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

  //get the reward programs information using graphQL
  const position = usePositionByUserQuery(
    {address: account},
    {
      pollingInterval: 2000,
    },
  );

  //get the open/closed status of the liquidity token
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

  //get the liquidity status of the reward program
  useEffect(() => {
    async function getPosition() {
      const uniswapStakerContract = new Contract(
        UniswapStaker_Address,
        STAKERABI.abi,
        library,
      );

      //gets the range data for the reward program
      async function getRangedData(stringResult: any) {
        const res = await Promise.all(
          stringResult.map(async (data: any) => {
            //finds the pool that the reward programs belongs to
            const includedPool = pool.find(
              (pol: any) =>
                ethers.utils.getAddress(pol.id) ===
                ethers.utils.getAddress(data.pool.id),
            );

            //if the pool exists, get the range of the pool, and return the following data for the reward program
            if (includedPool) {
              const rang = await getRange(
                Number(data.id),
                includedPool.tick,
                includedPool.id,
              );
              return {
                ...data,
                range: rang?.range,
                liquidity: rang?.res.liquidity,
              };
            }
          }),
        );

        //depending on the results of the above getRange function, create the state string and order them by ascending or descending order
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

        const open = openInOrdered.concat(openOutOrdered); //all the open reward programs
        const close = closedInOrdered.concat(closedOutOrdered); //all the closed reward programs
        const tokenList = open.concat(close); //all the reward programs closed and open
        setPositions(tokenList);
      }

      //refetch the reward programs data from graphql
      if (position.data && positionsByPool.data) {
        position.refetch();

        //if a pool is selected from the pools menu
        if (
          selectedPool !== undefined &&
          account !== undefined &&
          account !== null
        ) {
          //get the positions (reward programs) belonging to the selected pool
          const withStakedPosition = position.data.positions.filter(
            (position: any) => selectedPool.id === position.pool.id,
          );
          //from the reward programs of the pool, find the reward programs belonging to the user or the uniswap contract
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
          //get the tokens that were staked in the selected pool. if the owner of the result of the deposits function is the user,
          //then the user has deposited the lp token in the pool (staked)
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

          const allPos = withStakedPosition.concat(stringResult); //all the reward programs staked and unstaked
          await getRangedData(allPos); //get the range data of all the reward programs
          setTimeout(() => {
            setIsPositionLoading(false);
          }, 1500);
        }
        //if the pool is not selected from the pools menu
        // functions are same as above
        else if (
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

  //gets the range of the reward program
  const getRange = async (id: number, tick: string, address: string) => {
    const result = await rangePayload({library, id, account, tick, address});
    return result;
  };
  const rangePayload = async (args: any) => {
    const {library, id, tick, address} = args;
    if (account === undefined || library === undefined || account == null) {
      return;
    }
    const result = await fetchPositionRangePayload(
      library,
      id,
      account,
      tick,
      address,
    );
    return result;
  };

  //filters the reward programs
  useEffect(() => {
    if (account !== undefined && account !== null) {
      //these are the reward programs belonging to the user
      //will be sent to the manageContainer as props
      const filtered = orderedData.filter(
        (data) =>
          ethers.utils.getAddress(data.incentiveKey.refundee) ===
          ethers.utils.getAddress(account),
      );
      setManageDatas(filtered);
      setFilteredManageData(filtered);
    }
  }, [orderedData, sortString, account, library]);

  //gets the pool when the selected pool is changed from the pools menu and sets the reward programs data accordingly
  const getSelectedPool = (e: any) => {
    const poolAddress = e.target.value;
    const selected: Pool = pool.find(
      (pool) =>
        ethers.utils.getAddress(pool.id) ===
        ethers.utils.getAddress(poolAddress),
    );

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
        (data) =>
          ethers.utils.getAddress(data.poolAddress) ===
          ethers.utils.getAddress(poolAddress),
      );
      setOrderedData(selectedRewards);
      setFilteredData(selectedRewards);
    }
  };

  //function to handle reward token menu select change
  const getSelectedReardToken = (e: any) => {
    const tokenAddress = e.target.value;

    //filter the selected reward token from the tokens from the API depending on the value of the tokens menu
    const rewardToken: Token = tokenList.find(
      (token) => token.token === tokenAddress,
    );
    setSelectedToken(rewardToken);

    if (tokenAddress !== '') {
      //depending on the value from the menu, filter the reward programs that belong to the user
      const selectedManageRewards = manageDatas.filter(
        (data: any) =>
          ethers.utils.getAddress(data.rewardToken.toString()) ===
          ethers.utils.getAddress(tokenAddress),
      );

      setFilteredManageData(selectedManageRewards);
      //if the ordered data array is empty, filter the reward programs according to the selected reward token
      if (orderedData.length === 0) {
        const selectedRewards = datas.filter(
          (data) =>
            ethers.utils.getAddress(data.rewardToken.toString()) ===
            ethers.utils.getAddress(tokenAddress),
        );

        setFilteredData(selectedRewards);
      } else {
        //if not empty, filter the ordered reward programs according to the selected reward token
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
//get the reward programs that have been staked with the selected LP token
  const getSelectedPosition = (e: any) => {
    const pos = e.target.value;
    const selectedLP: any = positions.find((position) => position.id === pos);
    setSelectdPosition(selectedLP);
  };

  //gets the ERC20 token symbol
  const getTokenFromContract = async (address: string) => {
    const symbolContract = await getTokenSymbol(address, library);
    return symbolContract;
  };

  //gets the list of reward tokens from all the reward programs
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
        <Box pb={20}>
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
                {/* pools menu */}
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
                {/* reward tokens menu */}
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
                {/* lp tokens menu */}
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
                {/* sorting menu */}
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
                    onClick={(e: any) => {
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
                    onClick={(e: {preventDefault: () => void}) => {
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
              {/* switch button for manage state */}
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
              {/*  */}
            </Flex>
            <Flex flexDir={'row'} mt={'30px'} justifyContent={'space-between'}>
              {/* if the selected state is reward, render the reward child components else render the manage child components*/}
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
                    tokens={tokensFromAPI}
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
                  tokens={tokensFromAPI}
                />
              )}

              {/* display the side container */}
              <SideContainer
                pools={pool}
                selected={selected}
                rewards={datas}
                LPTokens={positions}
                tokens={tokensFromAPI}
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
