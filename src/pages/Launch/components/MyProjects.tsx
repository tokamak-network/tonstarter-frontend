import {Text, Flex, Box, useColorMode} from '@chakra-ui/react';

import {FC, useRef} from 'react';
import {useEffect, useMemo, useState} from 'react';

import {MyProjectTable} from './Projects/MyProjectTable';

const MyProjects = () => {
  // const theme = useTheme();
  // const match = useRouteMatch();
  const {colorMode} = useColorMode();

  const datalll = [
    {
      name: 'Dragons of midgard',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Listed on TONStarter',
      action: 'Edit',
    },
    {
      name: 'where Heckles dies',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Deployed',
      action: 'Listing on TONStarter',
    },
    {
      name: 'with Pheobes husband',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Deployed',
      action: 'Listing on TONStarter',
    },
    {
      name: 'where Ross finds out',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Not Deployed',
      action: 'Done',
    },
    {
      name: 'with the baby on the bus',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Deployed',
      action: 'Edit',
    },
    {
      name: 'with the List',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Listed on TONStarter',
      action: 'Edit',
    },
    {
      name: 'Dragons of midgard',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Not Deployed',
      action: 'Done',
    },
    {
      name: 'Where Eddie Moves In',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Deployed',
      action: 'Listing on TONStarter',
    },
    {
      name: 'Dragons of midgard',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Listed on TONStarter',
      action: 'Edit',
    },
    {
      name: 'Where Rachel Quits',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Deployed',
      action: 'Done',
    },
    {
      name: 'at the Beach',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Deployed',
      action: 'Edit',
    },
    {
      name: 'with the Fake Party',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Listed on TONStarter',
      action: 'Listing on TONStarter',
    },
    {
      name: 'where Heckles dies',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Deployed',
      action: 'Listing on TONStarter',
    },
    {
      name: 'Dragons of midgard',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Listed on TONStarter',
      action: 'Edit',
    },
    {
      name: 'with Pheobes husband',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Deployed',
      action: 'Listing on TONStarter',
    },
    {
      name: 'where Ross finds out',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Not Deployed',
      action: 'Done',
    },
    {
      name: 'with the baby on the bus',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Deployed',
      action: 'Edit',
    },
    {
      name: 'with the List',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Listed on TONStarter',
      action: 'Edit',
    },
    {
      name: 'Dragons of midgard',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Not Deployed',
      action: 'Done',
    },
  ];

  const dummyData: {
    data: any;
    columns: any;
    isLoading: boolean;
  } = {
    data: datalll,
    columns: useMemo(
      () => [
        {
          Header: 'Project Name',
          accessor: 'name',
        },
        {
          Header: 'Token Name',
          accessor: 'tokenName',
        },
        {
          Header: 'Token Symbol',
          accessor: 'tokenSymbol',
        },
        {
          Header: 'Token Supply',
          accessor: 'totalSupply',
        },
        {
          Header: 'Sale Date',
          accessor: 'saleDate',
        },
        {
          Header: 'Status',
          accessor: 'status',
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
    <Flex
      flexDir={'row'}
      alignSelf="center"
      w={'1102px'}
      h={'100%'}
      mt={'30px'}>
      <Box display={'flex'} flexDir={'column'}>
        <Text
          ml={'30px'}
          fontSize={'20px'}
          fontWeight={600}
          color={colorMode === 'light' ? '#304156' : 'white.100'}>
          Owned Projects
        </Text>
        <Box mt={'20px'}>
          <MyProjectTable data={data} columns={columns} isLoading={isLoading} />
        </Box>
      </Box>
    </Flex>
  );
};

export default MyProjects;
