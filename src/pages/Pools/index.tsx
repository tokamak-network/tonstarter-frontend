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
import {shortenAddress} from 'utils';
import {PoolTable} from './PoolTable';
// import {selectStakes} from './staking.reducer';
import {selectApp} from 'store/app/app.reducer';
import {selectUser} from 'store/app/user.reducer';
import {PageHeader} from 'components/PageHeader';
// import {LoadingComponent} from 'components/Loading';
import {useQuery} from '@apollo/client';
import { GET_POOL1, GET_POOL2, GET_POOL3, GET_POOL_BY_POOL_ADDRESS } from './GraphQL/index';


export const Pools = () => {
  const theme = useTheme();
  const {
    data: {address, library},
  } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const {colorMode} = useColorMode();
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
  
  const poolAddress = [
    "0xb7ce38cc28e199adcd8dfa5c89fe03d3e8d267f2",
    "0x516e1af7303a94f81e91e4ac29e20f4319d4ecaf",
    "0xfffcd9c7d2ab23c064d547387fce7e938fa3124b"
  ]; // need to convern the way to get pool address
  
  const pool1 = useQuery(GET_POOL1, {
    variables: {address: poolAddress[0]}
  });
  
  // const [pools, setPools] = useState<Array<T>>()
  // useEffect(() => {
  //   async function getPool () {
  //     console.log(pool1.loading)
  //     console.log(pool1)
  //     const mergedPool = await pool1.fetchMore({
  //       query: GET_POOL_BY_POOL_ADDRESS,
  //       variables: {address: poolAddress[1]}
  //     })
  //     console.log(mergedPool)
  //   }
  // }, [])
  
  const pool2 = useQuery(GET_POOL2, {
    variables: {address: poolAddress[1]}
  });
  const pool3 = useQuery(GET_POOL3, {
    variables: {address: poolAddress[2]}
  });

  const poolArr = pool1.loading || pool2.loading || pool3.loading ? [] : pool1.data.pools.concat(pool3.data.pools).concat(pool2.data.pools)
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
          {pool1.loading? '' :
          <PoolTable
            data={poolArr}
            columns={columns}
            isLoading={pool1.loading}
            address={account}
          />
          }
        </Box>
      </Container>
    </Fragment>
  );
};
