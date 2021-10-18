import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
import {DetailTableContainer} from './Detail_Table_Container';
import {SaleStatus, DetailTierData, DetailInfo} from '@Starter/types';

type DetailTableTierProp = {
  status: SaleStatus;
  detailInfo: DetailInfo;
};

export const DetailTableTier = (prop: DetailTableTierProp) => {
  const {status, detailInfo} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {STATER_STYLE} = theme;

  const projectTierData: DetailTierData = [
    {
      title: 'Tier 1',
      data: [
        {
          key: 'Criteria',
          value: `${detailInfo.tierCriteria[1]} sTOS`,
        },
        {
          key: 'Allocation',
          value: `${detailInfo.totalExpectSaleAmount[1]}`,
        },
        {
          key: 'Members',
          value: `${detailInfo.tierAccounts[1]}`,
        },
        {
          key: 'Member Allocation',
          value: `${detailInfo.tierAllocation[1]}`,
        },
      ],
    },
    {
      title: 'Tier 2',
      data: [
        {
          key: 'Criteria',
          value: `${detailInfo.tierCriteria[2]} sTOS`,
        },
        {
          key: 'Allocation',
          value: `${detailInfo.totalExpectSaleAmount[2]}`,
        },
        {
          key: 'Members',
          value: `${detailInfo.tierAccounts[2]}`,
        },
        {
          key: 'Member Allocation',
          value: `${detailInfo.tierAllocation[2]}`,
        },
      ],
    },
    {
      title: 'Tier 3',
      data: [
        {
          key: 'Criteria',
          value: `${detailInfo.tierCriteria[3]} sTOS`,
        },
        {
          key: 'Allocation',
          value: `${detailInfo.totalExpectSaleAmount[3]}`,
        },
        {
          key: 'Members',
          value: `${detailInfo.tierAccounts[3]}`,
        },
        {
          key: 'Member Allocation',
          value: `${detailInfo.tierAllocation[3]}`,
        },
      ],
    },
    {
      title: 'Tier 4',
      data: [
        {
          key: 'Criteria',
          value: `${detailInfo.tierCriteria[4]} sTOS`,
        },
        {
          key: 'Allocation',
          value: `${detailInfo.totalExpectSaleAmount[4]}`,
        },
        {
          key: 'Members',
          value: `${detailInfo.tierAccounts[4]}`,
        },
        {
          key: 'Member Allocation',
          value: `${detailInfo.tierAllocation[4]}`,
        },
      ],
    },
  ];

  const projectTierDataAfterWhiteList: DetailTierData = [
    {
      title: 'tier 1',
      data: [
        {
          key: 'Criteria',
          value: `${detailInfo.tierCriteria[1]} sTOS`,
        },
        {
          key: 'Allocation',
          value: `${detailInfo.totalExpectSaleAmount[1]}`,
        },
        {
          key: '#of Members',
          value: `${detailInfo.tierAccounts[1]}`,
        },
        {
          key: '#of Whitelisted',
          value: `${detailInfo.tierAccounts[1]}`,
        },
        {
          key: 'Expected Allocation',
          value: `${detailInfo.tierAllocation[1]}`,
        },
      ],
    },
    {
      title: 'tier 2',
      data: [
        {
          key: 'Criteria',
          value: `${detailInfo.tierCriteria[2]} sTOS`,
        },
        {
          key: 'Allocation',
          value: `${detailInfo.totalExpectSaleAmount[2]}`,
        },
        {
          key: '#of Members',
          value: `${detailInfo.tierAccounts[2]}`,
        },
        {
          key: '#of Whitelisted',
          value: `${detailInfo.tierAccounts[2]}`,
        },
        {
          key: 'Expected Allocation',
          value: `${detailInfo.tierAllocation[2]}`,
        },
      ],
    },
    {
      title: 'tier 3',
      data: [
        {
          key: 'Criteria',
          value: `${detailInfo.tierCriteria[3]} sTOS`,
        },
        {
          key: 'Allocation',
          value: `${detailInfo.totalExpectSaleAmount[3]}`,
        },
        {
          key: '#of Members',
          value: `${detailInfo.tierAccounts[3]}`,
        },
        {
          key: '#of Whitelisted',
          value: `${detailInfo.tierAccounts[3]}`,
        },
        {
          key: 'Expected Allocation',
          value: `${detailInfo.tierAllocation[3]}`,
        },
      ],
    },
    {
      title: 'tier 4',
      data: [
        {
          key: 'Criteria',
          value: `${detailInfo.tierCriteria[4]} sTOS`,
        },
        {
          key: 'Allocation',
          value: `${detailInfo.totalExpectSaleAmount[4]}`,
        },
        {
          key: '#of Members',
          value: `${detailInfo.tierAccounts[4]}`,
        },
        {
          key: '#of Whitelisted',
          value: `${detailInfo.tierAccounts[4]}`,
        },
        {
          key: 'Expected Allocation',
          value: `${detailInfo.tierAllocation[4]}`,
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
        {status === 'whitelist' &&
          projectTierData.map((item, index: number) => {
            return (
              <DetailTableContainer
                w={276}
                itemPx={'20px'}
                itemPy={'21px'}
                key={item.title}
                title={item.title}
                data={item.data}
                breakPoint={item.data.length}
                isUserTier={
                  index + 1 === detailInfo.userTier
                }></DetailTableContainer>
            );
          })}
        {status !== 'whitelist' &&
          projectTierDataAfterWhiteList.map((item, index: number) => {
            return (
              <DetailTableContainer
                w={276}
                itemPx={'20px'}
                itemPy={'21px'}
                key={item.title}
                title={item.title}
                data={item.data}
                breakPoint={item.data.length}
                isUserTier={
                  index + 1 === detailInfo.userTier
                }></DetailTableContainer>
            );
          })}
      </Box>
    </Flex>
  );
};
