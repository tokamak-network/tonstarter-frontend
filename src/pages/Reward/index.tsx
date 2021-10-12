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

export const Reward = () => {

  const {data, loading} = useAppSelector(selectRewards);
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [pools, setPools] = useState([]);
  const [programs, setPrograms] = useState<number[]>([]);
  const [selected, setSelected] = useState('reward');
  const poolsObj = [
    {name: 'WTON-TOS', rewardPrograms: [1234, 2345, 3456, 4567]},
    {name: 'ETH-WTON', rewardPrograms: [9876, 8765, 7654]},
    {name: 'ETH-TOS', rewardPrograms: [1928, 2837, 3746, 5555]},
  ];
  useEffect(() => {
    let poolArr: any = [];
    poolArr = poolsObj.map((pools) => {
      return pools.name;
    });
    setPools(poolArr);
    setPrograms(poolsObj[0].rewardPrograms);
  }, []);

  const onChangeSelectBoxPools = (e: any) => {
    const filterValue = e.target.value;
    console.log(filterValue);
    
    const result = poolsObj.filter((pool) => pool.name === filterValue);
    setPrograms(result[0].rewardPrograms);
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
        <Flex
          fontFamily={theme.fonts.roboto}
          flexDir={'row'}
          justifyContent={'space-between'}>
          <Flex>
            <Select
              w={'137px'}
              h={'32px'}
              color={'#86929d'}
              fontSize={'13px'}
              onChange={onChangeSelectBoxPools}>
              {pools.map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))}
            </Select>
            <Select w={'137px'} h={'32px'} color={'#86929d'} fontSize={'13px'}>
              {programs.map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))}
            </Select>
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
        {selected === 'reward' ? (
          <RewardContainer pools={data} />
        ) : (
          <ManageContainer pools={poolsObj} />
        )}
      </Container>
    </Fragment>
  );
};
