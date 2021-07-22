import {
  Container,
  Box,
  Text,
  Flex,
  Link,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';
import {IconClose} from 'components/Icons/IconClose';
import {IconOpen} from 'components/Icons/IconOpen';
import {Head} from 'components/SEO';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import React, {Fragment, useCallback, useMemo} from 'react';
import {shortenAddress} from 'utils';
import {PoolTable} from './PoolTable';
// import {selectStakes} from './staking.reducer';
import {selectApp} from 'store/app/app.reducer';
import {selectUser} from 'store/app/user.reducer';
import {PageHeader} from 'components/PageHeader';

export const Pools = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch();
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

  const renderRowSubComponent = useCallback(
    ({row}) => {
       
    }, [])

  return (
    <Fragment>
      <Head title={'Pools'} />
      <Container maxW={'6xl'}>
        <Box py={20}>
          <PageHeader 
            title={'Pools'}
            subtitle={
              'Add liquidity into TOS ecosystem and earn reward'
            }
          />
        </Box>
        <Box fontFamily={theme.fonts.roboto}>
          {/* <PoolTable 
            renderDetail={renderRowSubComponent}
            columns={columns}
            data={data}
            isLoading={loading === 'pending' ? true : false}
          /> */}
        </Box>
      </Container>
    </Fragment>
  )
}