import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
import {DetailTableContainer} from './Detail_Table_Container';

export const DetailTableTier = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {STATER_STYLE} = theme;

  const projectDetailTitle = 'Token Details';
  const projectDetailData = [
    {key: 'Name', value: 'Genesis Shards Public'},
    {key: 'Symbol', value: 'GSP'},
    {key: 'Contract', value: '0x9413336ef38202Dc49C4A5c94427FAA2eaf3C739'},
    {key: 'Total Supply', value: '10,000,000'},
  ];

  const projectDetailTitle2 = 'Sale Details';
  const projectDetailData2 = [
    {key: 'Sale Period', value: '2021. 10. 1 ~ 10. 7'},
    {key: 'Token Allocation', value: '10,000,000'},
    {
      key: 'Funding Crypto',
      value: 'TON',
    },
  ];

  const projectTierData = [
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

  return (
    <Flex flexDir="column">
      <Text {...STATER_STYLE.mainText({colorMode, fontSize: 24})} mb={'30px'}>
        Tier details
      </Text>
      <Box d="flex" justifyContent="space-between">
        {projectTierData.map((item) => {
          return (
            <DetailTableContainer
              w={276}
              title={item.title}
              data={item.data}
              breakPoint={item.data.length}></DetailTableContainer>
          );
        })}
      </Box>
    </Flex>
  );
};
