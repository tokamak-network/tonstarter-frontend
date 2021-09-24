import { useAppSelector } from '../../hooks/useRedux';
import { selectStarters } from './starter.reducer';
import { selectApp } from '../../store/app/app.reducer';
import React, {Fragment, useCallback, useMemo} from 'react';
import {Head} from 'components/SEO';
import { StarterEditTable } from './components/StarterEditTable';
import { PageHeader } from '../../components/PageHeader';
import {
  Container,
  Box,
  Text,
  Flex,
  Link,
  useColorMode,
  useTheme,
  Switch,
} from '@chakra-ui/react';
import {useActiveWeb3React} from 'hooks/useWeb3';

export const StarterEdit = () => {
  // @ts-ignore
  const {data, loading} = useAppSelector(selectStarters);
  // @ts-ignore
  const {data: appConfig} = useAppSelector(selectApp);
  const theme = useTheme();
  const {account} = useActiveWeb3React();
  const columns = useMemo(
    () => [
      {
        Header: 'name',
        accessor: 'name',
      },
      {
        Header: 'max allocation',
        accessor: 'max_allocation',
      },
      {
        Header: 'funding token',
        accessor: 'funding_token',
      },
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
      },
    ],
    [],
  );

  const myStarter = data.filter(data => account?.toLowerCase() == data.creator.toLowerCase())

  return (
    <Fragment>
      <Head title={'Starter Edit'} />
      <Container maxW={'6xl'}>
        <Box py={20}>
          <PageHeader
            title={'Edit Starter'}
            subtitle={'Add liquidity into TOS ecosystem and earn reward'}
          />
        </Box>
        <Box fontFamily={theme.fonts.roboto}>
          <StarterEditTable
            data={myStarter}
            columns={columns}
            address={account || undefined}
          />
        </Box>
      </Container>
    </Fragment>
  );
}