import {Flex, Box, useColorMode, Text, useTheme} from '@chakra-ui/react';
import {PageHeader} from 'components/PageHeader';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useMemo, useState} from 'react';
import {ListPoolsTable} from './components/ListPoolsTable';
import {EditPoolModal} from './components/EditPoolModal';
import {FetchReward, ListingPoolsTableData} from './types';
import {CustomInput} from 'components/Basic';
import {CustomButton} from 'components/Basic/CustomButton';
import AdminActions from './actions';
import {TokenImage} from './components/TokenImage';

export const ListingPools = () => {
  const {account, library, chainId} = useActiveWeb3React();
  const [projects, setProjects] = useState<ListingPoolsTableData[] | []>([]);

  const theme = useTheme();
  const {bgStyle} = theme;
  const {colorMode} = useColorMode();

  const [poolName, setPoolName] = useState<string>('');
  const [poolAddress, setPoolAddress] = useState<string>('');
  const [token0, setToken0] = useState<string>('');
  const [token1, setToken1] = useState<string>('');
  const [token0Image, setToken0Image] = useState<string>('');
  const [token1Image, setToken1Image] = useState<string>('');
  const [fee, setFee] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProjectsData() {
      const rewardData = await AdminActions.getRewardData();

      if (!rewardData) {
        setProjects([]);
        return setLoading(false);
      }

      const filteredRewardData: ListingPoolsTableData[] = rewardData.map(
        (data: FetchReward) => {
          return {
            name: data.poolName,
            address: data.poolAddress,
            rewardPrograms: 5,
          };
        },
      );

      setProjects(filteredRewardData);
      setLoading(false);
    }
    fetchProjectsData();
  }, [account, library]);

  const dummyData: {
    data: ListingPoolsTableData[];
    columns: any;
    isLoading: boolean;
  } = {
    data: projects,
    columns: useMemo(
      () => [
        {
          Header: 'Name',
          accessor: 'name',
        },
        {
          Header: 'Address',
          accessor: 'address',
        },
        {
          Header: 'Number of reward programs',
          accessor: 'rewardPrograms',
        },
        {
          Header: 'Action',
          accessor: 'action',
        },
      ],
      [],
    ),
    isLoading: loading,
  };

  const {data, columns, isLoading} = dummyData;

  return (
    <Flex mt={'110px'} flexDir="column" alignItems="center">
      <PageHeader
        title={'Listing Pools for Reward Program'}
        subtitle={'Manage pool addresses that provide rewards programs.'}
      />
      <Flex mt={'60px'} flexDir={'column'}>
        <Text
          fontSize={20}
          fontWeight={600}
          color={'black.300'}
          mb={'20px'}
          ml={'30px'}>
          Project
        </Text>
        <Box
          {...bgStyle.containerStyle({colorMode})}
          w={'1100px'}
          h={'250px'}
          d="flex"
          // py={'25px'}
          pl={'30px'}
          pr={'24px'}
          color={'black.400'}
          fontSize={'13px'}>
          <Box
            w={'394px'}
            d="flex"
            justifyContent="center"
            flexDir="column"
            mr={'45px'}>
            <Flex alignItems="center" mb={'20px'}>
              <Text w={'95px'}>Pool Name</Text>
              <Box>
                <CustomInput
                  value={poolName}
                  setValue={setPoolName}
                  placeHolder={'Input Pool Name'}
                  border={'1px solid #ffffff'}
                  w={'310px'}
                  h={'32px'}
                  br={4}
                  textAlign={'left'}
                  style={{
                    fontSize: '13px',
                    px: '15px',
                    py: '7px',
                  }}
                />
              </Box>
            </Flex>
            <Flex alignItems="center" mb={'20px'}>
              <Text w={'85px'}>Token0 : </Text>
              <CustomInput
                value={token0}
                setValue={setToken0}
                placeHolder={'Input Token0 Address'}
                w={'310px'}
                h={'32px'}
                textAlign={'left'}
                style={{
                  fontSize: '13px',
                  px: '15px',
                  py: '7px',
                }}
              />
            </Flex>
            <Flex alignItems="center" mb={'20px'}>
              <Text w={'85px'}>Token0 Image </Text>
              <CustomInput
                value={token0Image}
                setValue={setToken0Image}
                placeHolder={'Token0 Symbol Image URL'}
                w={'310px'}
                h={'32px'}
                textAlign={'left'}
                style={{
                  fontSize: '13px',
                  px: '15px',
                  py: '7px',
                }}
              />
            </Flex>
            <Flex alignItems="center">
              <Text w={'85px'}>Fee </Text>
              <CustomInput
                value={fee}
                setValue={setFee}
                placeHolder={'Input Fee number'}
                w={'310px'}
                h={'32px'}
                textAlign={'left'}
                style={{
                  fontSize: '13px',
                  px: '15px',
                  py: '7px',
                }}
              />
            </Flex>
          </Box>
          <Box
            w={'394px'}
            d="flex"
            justifyContent="flex-start"
            flexDir="column"
            mr={'20px'}
            mt={'30px'}
            pos="relative">
            <Flex alignItems="center" mb={'20px'}>
              <Text w={'95px'}>Pool Address</Text>
              <CustomInput
                value={poolAddress}
                setValue={setPoolAddress}
                placeHolder={'Input Pool Address'}
                w={'310px'}
                h={'32px'}
                br={4}
                textAlign={'left'}
                color={
                  poolName !== ''
                    ? colorMode === 'light'
                      ? 'gray.225'
                      : 'white.100'
                    : 'gray.175'
                }
                style={{
                  fontSize: '13px',
                  px: '15px',
                  py: '7px',
                }}
              />
            </Flex>
            <Flex alignItems="center" mb={'20px'}>
              <Text w={'95px'}>Token1 : </Text>
              <CustomInput
                value={token1}
                setValue={setToken1}
                placeHolder={'Input Token1 Address'}
                w={'310px'}
                h={'32px'}
                textAlign={'left'}
                style={{
                  fontSize: '13px',
                  px: '15px',
                  py: '7px',
                }}
              />
            </Flex>
            <Flex alignItems="center" mb={'13px'}>
              <Text w={'95px'}>Token1 Image </Text>
              <CustomInput
                value={token1Image}
                setValue={setToken1Image}
                placeHolder={'Token1 Symbol Image URL'}
                w={'310px'}
                h={'32px'}
                textAlign={'left'}
                style={{
                  fontSize: '13px',
                  px: '15px',
                  py: '7px',
                }}
              />
            </Flex>
            <Flex>
              <Box d="flex" alignItems="center">
                <Text>Token0 Image preview</Text>
                <TokenImage imageLink={token0Image} />
              </Box>
              <Box d="flex" alignItems="center">
                <Text>Token1 Image preview</Text>
                <TokenImage imageLink={token1Image} />
              </Box>
            </Flex>
          </Box>
          <CustomButton
            w={'180px'}
            h={'84px'}
            text={'Add Pool'}
            style={{alignSelf: 'center'}}
            func={() =>
              chainId &&
              AdminActions.addPool({
                chainId,
                poolName,
                poolAddress,
                token0Address: token0,
                token1Address: token1,
                token0Image,
                token1Image,
                feeTier: Number(fee),
              })
            }></CustomButton>
        </Box>
      </Flex>
      <Flex mt={'60px'} flexDir={'column'}>
        <Text
          fontSize={20}
          fontWeight={600}
          color={'black.300'}
          mb={'20px'}
          ml={'30px'}>
          Listing Pools
        </Text>
        {data.length > 0 && (
          <ListPoolsTable
            data={data}
            columns={columns}
            isLoading={isLoading}></ListPoolsTable>
        )}
      </Flex>
      <EditPoolModal></EditPoolModal>
    </Flex>
  );
};
