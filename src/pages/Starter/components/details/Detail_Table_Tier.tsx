import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
import {DetailTableContainer} from './Detail_Table_Container';

export const DetailTableTier = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {STATER_STYLE} = theme;

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
              itemPx={'20px'}
              itemPy={'21px'}
              title={item.title}
              data={item.data}
              breakPoint={item.data.length}></DetailTableContainer>
          );
        })}
      </Box>
    </Flex>
  );
};
