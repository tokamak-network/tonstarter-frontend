import {
  Container,
  Box,
  Text,
  Flex,
  Link,
  Select,
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
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
  Switch,
} from '@chakra-ui/react';
import {Fragment, useMemo, useEffect, useState} from 'react';
import {Head} from 'components/SEO';
import {SearchModal} from './RewardModals';
import {PageHeader} from 'components/PageHeader';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {ManageContainer} from './ManageContainer';
import {RewardContainer} from './RewardContainer';
import {selectRewards} from './reward.reducer';
import {useAppSelector} from 'hooks/useRedux';
import {selectTransactionType} from 'store/refetch.reducer';
import {usePoolByUserQuery} from 'store/data/enhanced';
import {DEPLOYED} from '../../constants/index';
import ms from 'ms.macro';
import {Contract} from '@ethersproject/contracts';
import {LoadingComponent} from 'components/Loading';
import {orderBy} from 'lodash';
import * as StakeUniswapABI from 'services/abis/StakeUniswapV3.json';
import {getSigner} from 'utils/contract';
import {getPoolName, checkTokenType} from '../../utils/token';
import {fetchPositionPayload} from '../Pools/utils/fetchPositionPayload';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import {ChevronDownIcon} from '@chakra-ui/icons';

import {
  usePositionByUserQuery,
  usePositionByContractQuery,
  usePositionByPoolQuery,
  usePoolByArrayQuery
} from 'store/data/generated';
import {SideContainer} from './SideContainer';
const {
  UniswapStaking_Address,
  DOCPool_Address,
  BasePool_Address,
  UniswapStaker_Address,
} = DEPLOYED;
type Pool = {
  feeTier: string;
  id: string;
  liquidity: string;
  poolDayData: [];
  tick: string;
  token0: Token;
  token1: Token;
};
type Token = {
  id: string;
  symbol: string;
};

type incentiveKey = {
  rewardToken: string;
  pool: string;
  startTime: Number;
  endTime: Number;
  refundee: string;
};
type Reward = {
  chainId: Number;
  poolName: String;
  poolAddress: String;
  rewardToken: String;
  incentiveKey: incentiveKey;
  startTime: Number;
  endTime: Number;
  allocatedReward: String;
  numStakers: Number;
  status: String;
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
  const {datas, loading} = useAppSelector(selectRewards);
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {account, library} = useActiveWeb3React();
  const [selectedPool, setSelectedPool] = useState<Pool>();
  const [selectdPosition, setSelectdPosition] = useState<string>('');
  const [selected, setSelected] = useState('reward');
  const [pool, setPool] = useState<any[]>([]);
  const [stakingPosition, setStakingPosition] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [manageDatas, setManageDatas] = useState<Reward[]>([]);
  const [isPositionLoading, setIsPositionLoading] = useState(true);
  const [sortString, setSortString] = useState<string>('start');
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const [orderedData, setOrderedData] = useState<Reward[]>([]);
  const [order, setOrder] = useState<boolean | 'desc' | 'asc'>('desc');

  // const {isLoading, isError, error, isUninitialized, data} = usePoolByUserQuery(
  //   {address: BasePool_Address?.toLowerCase()},
  //   {pollingInterval: ms`2m`},
  // );
  // const dataddd = usePoolByUserQuery(
  //   {address: DOCPool_Address},
  //   {
  //     pollingInterval: ms`2m`,
  //   },
  // );
  
  const arr: any = [];
  arr.push(BasePool_Address.toLowerCase())
  arr.push(DOCPool_Address)
  const poolArr = usePoolByArrayQuery(
    {address: arr},
    {
      pollingInterval: ms`2m`,
    },
  )

  const positionsByPool = usePositionByPoolQuery(
    {pool_id: arr},
    {
      pollingInterval: ms`2m`,
    },
  );

  useEffect(() => {
    const filteredData = filterDatas();
    setOrderedData(filteredData);
  }, [sortString, datas]);

  const changeSelect = (e: any) => {
    const filterValue = e.target.value;
    order === 'desc' ? setOrder('asc') : setOrder('desc');
    setSortString(filterValue);
  };

  const filterDatas = () => {
    switch (sortString) {
      case 'start':
        return orderBy(datas, (data) => data.startTime, [order]);
      case 'end':
        return orderBy(datas, (data) => data.endTime, [order]);
      default:
        return datas;
    }
  };

  useEffect(() => {
  setPool(poolArr.data?.pools)
  }, [
    account,
    transactionType,
    blockNumber,
    poolArr
    
  ]);

  useEffect(() => {
    async function positionPayload() {
      if (account) {
        const result = await fetchPositionPayload(library, account);
        
        let stringResult: any = [];
        for (let i = 0; i < result?.positionData.length; i++) {
          stringResult.push(result?.positionData[i]?.positionid.toString());
        }
        setStakingPosition(stringResult);

        const StakeUniswap = new Contract(
          UniswapStaking_Address,
          StakeUniswapABI.abi,
          library,
        );
        if (library !== undefined) {
          const signer = getSigner(library, account);
          const positionIds = await StakeUniswap.connect(
            signer,
          ).getUserStakedTokenIds(account);
        }
        if (orderedData.length !== 0) {
          setTimeout(() => {
            setIsPositionLoading(false);
          }, 1500);
        }
      }
    }
    positionPayload();
  }, [account, orderedData, library]);

  const position = usePositionByUserQuery(
    {address: account},
    {
      pollingInterval: ms`2m`,
    },
  );

  const positionByContract = usePositionByContractQuery(
    {id: stakingPosition},
    {
      pollingInterval: ms`2m`,
    },
  );

  const [positions, setPositions] = useState([]);

  useEffect(() => {
    async function getPosition() {
      const uniswapStakerContract = new Contract(
        UniswapStaker_Address,
        STAKERABI.abi,
        library,
      );

      if (
        position.data &&
        positionByContract.data &&
        positionsByPool.data
      ) {
        position.refetch();
        if (selectedPool !== undefined) {
          const withStakedPosition = position.data.positions.filter(
            (position: any) => selectedPool.id === position.pool.id,
          );
          const pols = positionsByPool.data.positions.filter(
            (position: any) =>
              position.owner === UniswapStaker_Address.toLowerCase(),
          )
           const poolsFromSelected = pols.filter((token:any)=> (
            token.pool.id === selectedPool.id
           ))           
           
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
          console.log('allPos', allPos);
          
          setPositions(allPos);
        }
        else {
          setPositions([]);
        }
      }
    }
    getPosition();
    /*eslint-disable*/
  }, [
    pool,
    selectedPool,
    transactionType,
    blockNumber,
    position.isLoading,
    positionByContract.isLoading,
    position.data,
    positionByContract.data,
    account,
  ]);

  useEffect(() => {
    const filtered = orderedData.filter(
      (data) => data.incentiveKey.refundee === account,
    );
    setManageDatas(filtered);
  }, [orderedData, sortString, account, library]);

  const getSelectedPool = (e: any) => {    
    const poolAddress =  e.target.value
    const selected: Pool[] = pool.filter((pool) => pool.id === poolAddress);
    setSelectedPool(selected[0]);
  
    if (poolAddress === '') {
      setOrderedData(datas);
    } else {
      const selectedRewards = datas.filter(
        (data) => data.poolAddress === poolAddress,
      );
      setOrderedData(selectedRewards);
    }
  };
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
        {isPositionLoading !== true && account !== undefined ? (
          <Box>
            <Flex
              fontFamily={theme.fonts.roboto}
              flexDir={'row'}
              justifyContent={'space-between'}>
              <Flex alignItems={'center'}>
                 <Menu isLazy>
            <MenuButton
            mr={'10px'}
            border={themeDesign.border[colorMode]}
            padding={'10px'}
            borderRadius={'4px'}
              h={'32px'}
              color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
              fontSize={'12px'}
              w={'157px'}>
              <Text w={'100%'} display={'flex'} flexDir={'row'} alignItems={'center'} justifyContent={'space-between'}>
                {selectedPool ===undefined? 'All Pools' : `${selectedPool.token0.symbol} / ${selectedPool.token1.symbol}    (${
                    parseInt(selectedPool.feeTier) / 10000} %) `  }
                <span>
                 <ChevronDownIcon/>
                </span>
              </Text>
            </MenuButton>
            <MenuList zIndex={10000} m={'0px'} minWidth="157px" background={colorMode==='light'? '#ffffff': '#222222'}>
            <MenuItem  onClick={getSelectedPool}
               h={'30px'}
               color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
               fontSize={'12px'}
               w={'157px'}
               m={'0px'}
               value={''}
               _hover={{background: 'transparent',color: 'blue.100'}}
               _focus={{background: 'transparent'}}>All pools</MenuItem>
              {pool.map((item, index) => (
               
               <MenuItem
                  onClick={getSelectedPool}
                  h={'30px'}
                  color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
                  fontSize={'12px'}
                  w={'157px'}
                  m={'0px'}
                  value={item.id}
                  _hover={{background: 'transparent',color: 'blue.100'}}
                  _focus={{background: 'transparent'}}
                  key={index}>
                  {`${item.token0.symbol} / ${item.token1.symbol}    (${
                    parseInt(item.feeTier) / 10000
                  } %) `}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
                <Select
                  w={'137px'}
                  h={'32px'}
                  color={'#86929d'}
                  fontSize={'13px'}
                  placeholder="My LP tokens"
                  onChange={(e) => {
                    setSelectdPosition(e.target.value);
                  }}>
                  {selectedPool !==undefined ? 
                  positions.map((item: any, index) => (
                    <option value={item.id} key={index}>
                      {item.id}
                    </option>
                  )) : null
                }
                </Select>
                {positions.length === 0 ? (
                  <Text
                    textDecoration={'underline'}
                    pl={'20px'}
                    cursor={'pointer'}
                    color={'#0070ed'}
                    fontSize={'13px'}
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(
                        'https://app.uniswap.org/#/add/0x409c4D8cd5d2924b9bc5509230d16a61289c8153/0xc4A11aaf6ea915Ed7Ac194161d2fC9384F15bff2/3000',
                      );
                    }}>
                    Create your liquidity tokens here
                  </Text>
                ) : null}
              </Flex>
              <Flex>
                <FormControl display="flex" alignItems="center" mr={'45px'}>
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
                <Select
                  h={'32px'}
                  color={'#86929d'}
                  fontSize={'13px'}
                  onChange={changeSelect}>
                  <option value="start">Start Date</option>
                  <option value="end">End Date</option>
                </Select>
              </Flex>
            </Flex>
            <Flex flexDir={'row'} mt={'30px'} justifyContent={'space-between'}>
              {selected === 'reward' ? (
                <RewardContainer
                  rewards={orderedData}
                  position={selectdPosition}
                  selectedPool={selectedPool}
                  pools={pool}
                />
              ) : (
                <ManageContainer
                  position={selectdPosition}
                  selectedPool={selectedPool}
                  rewards={manageDatas}
                  pools={pool}
                />
              )}
              <SideContainer
                pools={pool}
                selected={selected}
                rewards={datas}
                LPTokens={positions}
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
    </Fragment>
  );
};
