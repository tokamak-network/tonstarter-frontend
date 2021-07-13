import {Container, Box, useTheme} from '@chakra-ui/react';
import React, {Fragment, useMemo} from 'react';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {selectUser} from 'store/app/user.reducer';
import {Head} from 'components/SEO';
import {PageHeader} from 'components/PageHeader';
import {PoolTable, RenderRowSub} from './Components';
import {IconClose} from 'components/Icons/IconClose';
import {IconOpen} from 'components/Icons/IconOpen';

export const Pools = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  // @ts-ignore
  // const {data, loading} = useAppSelector(selectStakes);
  const {data: user} = useAppSelector(selectUser);
  // @ts-ignore
  const {data: appConfig} = useAppSelector(selectApp);
  const columns = useMemo(
    () => [
      {
        Header: 'name',
        accessor: 'name',
      },
      {
        Header: 'period',
        accessor: 'period',
      },
      // {
      //   Header: 'APY',
      //   accessor: 'apy',
      // },
      {
        Header: 'total staked',
        accessor: 'stakeBalanceTON',
      },
      {
        Header: 'Earning Per Block',
        accessor: 'earning_per_block',
      },
      // {
      //   Header: 'My Staked',
      //   accessor: 'mystaked',
      // },
      // {
      //   Header: 'Earned',
      //   accessor: 'totalRewardAmount',
      // },
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

  const data = [
    {
      name: 'ETH-TOS',
      liquidity: Number(1000000),
      volume: Number(1000000),
      fees: Number(1000000),
    },
  ];

  return (
    <Fragment>
      <Head title={'Staking'} />
      <Container maxW={'6xl'}>
        <Box py={20}>
          <PageHeader
            title={'Pools'}
            subtitle={'Add liquidity into TOS ecosystem and earn reward'}
          />
        </Box>
        <Box fontFamily={theme.fonts.roboto}>
          {/* <PoolTable
            renderDetail={RenderRowSub}
            columns={columns}
            data={data}
            isLoading={loading === 'pending' ? true : false}
          /> */}
        </Box>
      </Container>
    </Fragment>
  );
};
