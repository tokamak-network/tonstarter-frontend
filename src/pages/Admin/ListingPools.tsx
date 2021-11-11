import {Flex, Box, useColorMode, Text, useTheme} from '@chakra-ui/react';
import {PageHeader} from 'components/PageHeader';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useMemo, useState} from 'react';
import {ListPoolsTable} from './components/ListPoolsTable';
import {DistributeModal} from './components/DistributeModal';
import {ListingPoolsTableData} from './types';
import {CustomInput} from 'components/Basic';
import {CustomButton} from 'components/Basic/CustomButton';

export const ListingPools = () => {
  const {account, library} = useActiveWeb3React();
  const [projects, setProjects] = useState<ListingPoolsTableData[] | []>([]);

  const theme = useTheme();
  const {bgStyle} = theme;
  const {colorMode} = useColorMode();

  const [poolName, setPoolName] = useState<string>('');
  const [poolAddress, setPoolAddress] = useState<string>('');
  const [token0, setToken0] = useState<string>('');
  const [token1, setToken1] = useState<string>('');

  useEffect(() => {
    async function fetchProjectsData() {
      const res = [
        {
          name: 'TOS-WTON',
          address: '0xb2e518b841b0cb7124ddadcbb882bbced4337cbf',
          rewardPrograms: 5,
          action: {},
        },
      ];
      if (res) {
        return setProjects(res);
      }
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
    isLoading: false,
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
          h={'134px'}
          d="flex"
          py={'25px'}
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
            <Flex alignItems="center">
              <Text w={'85px'}>Token0 : </Text>
              <CustomInput
                value={token0}
                setValue={setToken0}
                placeHolder={'Input Pool Name'}
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
            justifyContent="center"
            flexDir="column"
            mr={'20px'}>
            <Flex alignItems="center" mb={'20px'}>
              <Text w={'95px'}>Pool Address</Text>
              <CustomInput
                value={poolAddress}
                setValue={setPoolAddress}
                placeHolder={'Input Pool Name'}
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
            <Flex alignItems="center">
              <Text w={'95px'}>Token1 : </Text>
              <CustomInput
                value={token1}
                setValue={setToken1}
                placeHolder={'Input Pool Name'}
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
          <CustomButton
            w={'180px'}
            h={'84px'}
            text={'Add Pool'}
            func={() => console.log('test')}></CustomButton>
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
      <DistributeModal></DistributeModal>
    </Flex>
  );
};
