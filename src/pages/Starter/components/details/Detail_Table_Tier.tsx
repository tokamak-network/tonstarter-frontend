import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {DetailTableContainer} from './Detail_Table_Container';
import {SaleStatus, DetailTierData, Tier} from '@Starter/types';

type DetailTableTierProp = {
  status: SaleStatus;
  userTier: Tier;
};

export const DetailTableTier = (prop: DetailTableTierProp) => {
  const {status, userTier} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {STATER_STYLE} = theme;

  const projectTierData: DetailTierData = [
    {
      title: 'Tier 1',
      data: [
        {
          key: 'Criteria',
          value: '10,000,000 sTOS',
        },
        {
          key: 'Allocation',
          value: '10,000,000',
        },
        {
          key: 'Members',
          value: '10,000',
        },
        {
          key: 'Member Allocation',
          value: '10,000,000',
        },
      ],
    },
    {
      title: 'Tier 2',
      data: [
        {
          key: 'Criteria',
          value: '10,000,000 sTOS',
        },
        {
          key: 'Allocation',
          value: '10,000,000',
        },
        {
          key: 'Members',
          value: '10,000',
        },
        {
          key: 'Member Allocation',
          value: '10,000,000',
        },
      ],
    },
    {
      title: 'Tier 3',
      data: [
        {
          key: 'Criteria',
          value: '10,000,000 sTOS',
        },
        {
          key: 'Allocation',
          value: '10,000,000',
        },
        {
          key: 'Members',
          value: '10,000',
        },
        {
          key: 'Member Allocation',
          value: '10,000,000',
        },
      ],
    },
    {
      title: 'Tier 4',
      data: [
        {
          key: 'Criteria',
          value: '10,000,000 sTOS',
        },
        {
          key: 'Allocation',
          value: '10,000,000',
        },
        {
          key: 'Members',
          value: '10,000',
        },
        {
          key: 'Member Allocation',
          value: '10,000,000',
        },
      ],
    },
  ];

  const projectTierDataAfterWhiteList: DetailTierData = [
    {
      title: 'tier 01',
      data: [
        {
          key: 'Criteria',
          value: '10,000,000 sTOS',
        },
        {
          key: 'Allocation',
          value: '10,000,000 sTOS',
        },
        {
          key: '#of Members',
          value: '10,000',
        },
        {
          key: '#of Whitelisted',
          value: '10,000',
        },
        {
          key: 'Expected Allocation',
          value: '10,000,000 sTOS',
        },
      ],
    },
    {
      title: 'tier 02',
      data: [
        {
          key: 'Criteria',
          value: '10,000,000 sTOS',
        },
        {
          key: 'Allocation',
          value: '10,000,000 sTOS',
        },
        {
          key: '#of Members',
          value: '10,000',
        },
        {
          key: '#of Whitelisted',
          value: '10,000',
        },
        {
          key: 'Expected Allocation',
          value: '10,000,000 sTOS',
        },
      ],
    },
    {
      title: 'tier 03',
      data: [
        {
          key: 'Criteria',
          value: '10,000,000 sTOS',
        },
        {
          key: 'Allocation',
          value: '10,000,000 sTOS',
        },
        {
          key: '#of Members',
          value: '10,000',
        },
        {
          key: '#of Whitelisted',
          value: '10,000',
        },
        {
          key: 'Expected Allocation',
          value: '10,000,000 sTOS',
        },
      ],
    },
    {
      title: 'tier 04',
      data: [
        {
          key: 'Criteria',
          value: '10,000,000 sTOS',
        },
        {
          key: 'Allocation',
          value: '10,000,000 sTOS',
        },
        {
          key: '#of Members',
          value: '10,000',
        },
        {
          key: '#of Whitelisted',
          value: '10,000',
        },
        {
          key: 'Expected Allocation',
          value: '10,000,000 sTOS',
        },
      ],
    },
  ];

  return (
    <Flex flexDir="column">
      <Text {...STATER_STYLE.mainText({colorMode, fontSize: 24})} mb={'30px'}>
        Tier details
      </Text>
      <Box d="flex" justifyContent="space-between">
        {projectTierDataAfterWhiteList.map((item, index: number) => {
          return (
            <DetailTableContainer
              w={276}
              itemPx={'20px'}
              itemPy={'21px'}
              key={item.title}
              title={item.title}
              data={item.data}
              breakPoint={item.data.length}
              isUserTier={index + 1 === userTier}></DetailTableContainer>
          );
        })}
      </Box>
    </Flex>
  );
};
