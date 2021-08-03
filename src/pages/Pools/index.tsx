import {
  Container,
  Box,
  Text,
  Flex,
  Link,
  useColorMode,
  Select,
  useTheme,
} from '@chakra-ui/react';
import {IconClose} from 'components/Icons/IconClose';
import {IconOpen} from 'components/Icons/IconOpen';
import {Head} from 'components/SEO';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import React, {
  Fragment,
  useCallback,
  useMemo,
  useEffect,
  useState,
} from 'react';
import {
  ClaimOptionModal,
  StakeOptionModal,
  UnstakeOptionModal,
} from './PoolOptionModal';
import {shortenAddress} from 'utils';
import {PoolTable} from './PoolTable';
// import {selectStakes} from './staking.reducer';
import {selectApp} from 'store/app/app.reducer';
import {selectUser} from 'store/app/user.reducer';
import {PageHeader} from 'components/PageHeader';
// import {LoadingComponent} from 'components/Loading';
import {useQuery} from '@apollo/client';
import { GET_TOS_POOL, GET_BASE_POOL, GET_POOL_BY_POOL_ADDRESS } from './GraphQL/index';
import { selectTransactionType } from 'store/refetch.reducer';
import { DEPLOYED } from '../../constants/index';

const { BasePool_Address, TOS_ADDRESS } = DEPLOYED;


export const Pools = () => {
  const theme = useTheme();
  const {
    data: {address, library},
  } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const {colorMode} = useColorMode();
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);

  const columns = useMemo(
    () => [
      {
        Header: 'name',
        accessor: 'name',
      },
      {
        Header: 'Liquidity',
        accessor: 'liquidity',
      },
      {
        Header: 'Volume(24hrs)',
        accessor: 'volume',
      },
      {
        Header: 'Fee(24hrs)',
        accessor: 'fee',
      },
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({row}: {row: any}) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <IconClose /> : <IconOpen />}
          </span>
        ),
      },
    ],
    [],
  );
  
  const basePool = useQuery(GET_BASE_POOL, {
    variables: {address: BasePool_Address}
  });

  const tosPool = useQuery(GET_TOS_POOL, {
    variables: {address: [TOS_ADDRESS.toLowerCase()]}
  });
  console.log(basePool.loading, basePool.error, basePool.data)
  const [pool, setPool] = useState([]);
  useEffect(() => {
    function getPool () {
      const poolArr = basePool.loading || tosPool.loading ? [] : basePool.data.pools.concat(tosPool.data.pools)
      setPool(poolArr)
    }
    getPool()
  }, [transactionType, blockNumber, basePool.loading, tosPool.loading])

  // const poolArr = pool1.loading || pool2.loading || pool3.loading ? [] : pool1.data.pools.concat(pool3.data.pools).concat(pool2.data.pools)
  // const poolArr = pool1.loading || pool2.loading ? [] : pool1.data.pools.concat(pool2.data.pools)
  const account = address ? address : ''

  return (
    <Fragment>
      <Head title={'Pools'} />
      <Container maxW={'6xl'}>
        <Box py={20}>
          <PageHeader
            title={'Pools'}
            subtitle={'Add liquidity into TOS ecosystem and earn reward'}
          />
        </Box>
        <Box fontFamily={theme.fonts.roboto}>
          {basePool.loading? '' :
          <PoolTable
            data={pool}
            columns={columns}
            isLoading={basePool.loading}
            address={account}
            library={library}
          />
          }
        </Box>
      </Container>
      <StakeOptionModal />
      <UnstakeOptionModal />
      <ClaimOptionModal />
    </Fragment>
  );
};
