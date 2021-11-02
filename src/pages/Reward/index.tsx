import {
  Container,
  Box,
  Text,
  Flex,
  Link,
  Select,
  useColorMode,
  FormControl,
  FormLabel,
  useTheme,
  Switch,
} from '@chakra-ui/react';
import {Fragment, useMemo, useEffect, useState} from 'react';
import {Head} from 'components/SEO';
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
import * as StakeUniswapABI from 'services/abis/StakeUniswapV3.json';
import {getSigner} from 'utils/contract';
import {getPoolName, checkTokenType} from '../../utils/token';
import {fetchPositionPayload} from '../Pools/utils/fetchPositionPayload';
import {
  usePositionByUserQuery,
  usePositionByContractQuery,
} from 'store/data/generated';
import {SideContainer} from './SideContainer'
const {UniswapStaking_Address, UniswapStaker_Address, NPM_Address} = DEPLOYED;
type Pool = {
  id: string, 
  liquidity: string,
  poolDayData: [],
  tick: string,
  token0: Token,
  token1: Token
}
type Token = {
  id: string,
  symbol: string
}

export const Reward = () => {

  const {datas, loading} = useAppSelector(selectRewards);
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [selectedPool, setSelectedPool] = useState<Pool>();
  const [selectdPosition, setSelectdPosition] = useState<string>('');
  const [selected, setSelected] = useState('reward');
  const [pool, setPool] = useState([]);
  const [stakingPosition, setStakingPosition] = useState([]);
  const [positionData, setPositionData] = useState([]);
    const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
    const {
      // TOS_ADDRESS,
      BasePool_Address,
    } = DEPLOYED;
  const {isLoading, isError, error, isUninitialized, data} = usePoolByUserQuery(
    {address: BasePool_Address?.toLowerCase()},
    {
      pollingInterval: ms`2m`,
    },
  );

  useEffect(() => {
    function getPool() {
      const poolArr = isLoading ? [] : data.pools;
      setSelectedPool(poolArr[0]);
      setPool(poolArr);
    }
    getPool();
  }, [
    account,
    transactionType,
    blockNumber,
    isLoading,
    isError,
    isUninitialized,
    error,
    data,
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
        if (library !== undefined){
          const signer = getSigner(library, account);
          const positionIds = await StakeUniswap.connect(signer).getUserStakedTokenIds(account);
        }
       
        
      }
    }
    positionPayload();
  },[account, library]);
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
    function getPosition() {
      if (position.data && positionByContract.data) {
        position.refetch();
      
        pool.map((pool: any) => {
           const withStakedPosition = position.data.positions.filter((position: any) => pool.id === position.pool.id)
           setPositions(withStakedPosition);
           console.log('withStakedPosition', withStakedPosition);
           
           setSelectdPosition(withStakedPosition[0].id)
        })
       
      }
    }
    getPosition();
    /*eslint-disable*/
  }, [
    pool,
    transactionType,
    blockNumber,
    position.isLoading,
    positionByContract.isLoading,
    position.data,
    positionByContract.data,
    account,
  ]);


  // const onChangeSelectBoxPools = (e: any) => {
  //   const filterValue = e.target.value;
  //   console.log('filterValue', filterValue);
  // };

  return (
    <Fragment>
      <Head title={'Reward'} />
      <Container maxW={'6xl'}>
        {selectedPool? (<Box>
        <Box py={20}>
          <PageHeader
            title={'Rewards Program'}
            subtitle={'Stake Uniswap V3 liquidity tokens and receive rewards! '}
          />
        </Box>
       
        <Flex
          fontFamily={theme.fonts.roboto}
          flexDir={'row'}
          justifyContent={'space-between'}>
          <Flex>
            <Select
              w={'157px'}
              h={'32px'}
              color={'#86929d'}
              mr={'10px'}
              fontSize={'13px'}
              onChange={(e) => {
              }}>
              {pool.map((item: any, index) => {
                const poolName = getPoolName(item.token0.symbol, item.token1.symbol)
                return (
                  <option value={item.id} key={index}>
                  {poolName}
                </option>
                )
                
              }   )}
            </Select>
            <Select w={'137px'} h={'32px'} color={'#86929d'} fontSize={'13px'} onChange={(e) => {
                setSelectdPosition(e.target.value);
                
              }}>
              {positions.map((item: any, index) => (
                <option value={item.id} key={index}>
                  {item.id}
                </option>
              ))}
            </Select>
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
            <Select h={'32px'} color={'#86929d'} fontSize={'13px'}>
              <option value="name">Start Date</option>
              <option value="liquidity">End Date</option>
              <option value="volume">Stakeable</option>
              <option value="fee">Claimable</option>
              <option value="fee">Joined</option>
              <option value="fee">Refundable</option>
            </Select>
          </Flex>
        </Flex>
        <Flex flexDir={'row'} mt={'30px'} justifyContent={'space-between'}>
        {selected === 'reward' ? (
          <RewardContainer rewards={datas} position={selectdPosition} pool={selectedPool}/>
        ) : (
          <ManageContainer  />
        )}
        <SideContainer pools={pool} selected={selected} rewards={datas} LPTokens={positions}/> </Flex>
        
        
        </Box>) : null}
      </Container>
    </Fragment>
  );
};
