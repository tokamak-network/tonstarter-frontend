import {
  Container,
  Box,
  // useColorMode,
  useTheme,
} from '@chakra-ui/react';
import {IconClose} from 'components/Icons/IconClose';
import {IconOpen} from 'components/Icons/IconOpen';
import {Head} from 'components/SEO';
import {useAppSelector} from 'hooks/useRedux';
import {
  Fragment,
  useMemo,
  useEffect,
  useState,
} from 'react';
import {
  ClaimOptionModal,
} from './PoolOptionModal';
import {PoolTable} from './PoolTable';
import {PageHeader} from 'components/PageHeader';
// import {LoadingComponent} from 'components/Loading';
import {useQuery} from '@apollo/client';
import {
  // GET_TOS_POOL,
  GET_BASE_POOL
} from './GraphQL/index';
import { selectTransactionType } from 'store/refetch.reducer';
import { DEPLOYED } from '../../constants/index';
import { useUser } from '../../hooks/useUser';


const {
  // TOS_ADDRESS,
  BasePool_Address
} = DEPLOYED;


export const Pools = () => {
  const theme = useTheme();
  const {account, library} = useUser();
  // const dispatch = useAppDispatch();
  // const {colorMode} = useColorMode();
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);

  const columns = useMemo(
    () => [
      {
        Header: 'name',
        accessor: 'name',
      },
      {
        Header: 'liquidity',
        accessor: 'liquidity',
      },
      {
        Header: 'volume',
        accessor: 'volume',
      },
      {
        Header: 'fee',
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

  // const tosPool = useQuery(GET_TOS_POOL, {
  //   variables: {address: [TOS_ADDRESS.toLowerCase()]}
  // });
  
  const [pool, setPool] = useState([]);
  useEffect(() => {
    function getPool () {
      // const poolArr = basePool.loading || tosPool.loading ? [] : basePool.data.pools.concat(tosPool.data.pools)
      // const poolArr = tosPool.loading ? [] : tosPool.data.pools
      const poolArr = basePool.loading ? [] : basePool.data.pools
      setPool(poolArr)
    }
    getPool()
  }, [
    transactionType,
    blockNumber,
    basePool.loading,
    // tosPool.loading,
    basePool.error,
    // tosPool.error,
    basePool.data,
    // tosPool.data,
  ])

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
      <ClaimOptionModal />
    </Fragment>
  );
};
