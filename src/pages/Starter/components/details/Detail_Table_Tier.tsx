import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
import {DetailTableContainer} from './Detail_Table_Container';
import {SaleStatus, DetailTierData, DetailInfo} from '@Starter/types';
import {convertTimeStamp} from 'utils/convertTIme';
import {useWeb3React} from '@web3-react/core';

type DetailTableTierProp = {
  status: SaleStatus;
  detailInfo: DetailInfo | undefined;
};

export const DetailTableTier = (prop: DetailTableTierProp) => {
  const {status, detailInfo} = prop;
  const {colorMode} = useColorMode();
  const {library} = useWeb3React();

  const theme = useTheme();

  const {STATER_STYLE} = theme;

  const noLibraryText = 'XXX,XXX';

  const projectTierData: DetailTierData = [
    {
      title: 'Tier 1',
      data: [
        {
          key: 'Criteria',
          value: `${detailInfo?.tierCriteria[1] || noLibraryText} sTOS`,
        },
        {
          key: 'Allocation',
          value: `${detailInfo?.totalExpectSaleAmount[1] || noLibraryText}`,
        },
        {
          key: 'Members',
          value: `${detailInfo?.tierAccounts[1] || noLibraryText}`,
        },
        {
          key: 'Member Allocation',
          value: `${detailInfo?.tierAllocation[1] || noLibraryText}`,
        },
      ],
    },
    {
      title: 'Tier 2',
      data: [
        {
          key: 'Criteria',
          value: `${detailInfo?.tierCriteria[2] || noLibraryText} sTOS`,
        },
        {
          key: 'Allocation',
          value: `${detailInfo?.totalExpectSaleAmount[2] || noLibraryText}`,
        },
        {
          key: 'Members',
          value: `${detailInfo?.tierAccounts[2] || noLibraryText}`,
        },
        {
          key: 'Member Allocation',
          value: `${detailInfo?.tierAllocation[2] || noLibraryText}`,
        },
      ],
    },
    {
      title: 'Tier 3',
      data: [
        {
          key: 'Criteria',
          value: `${detailInfo?.tierCriteria[3] || noLibraryText} sTOS`,
        },
        {
          key: 'Allocation',
          value: `${detailInfo?.totalExpectSaleAmount[3] || noLibraryText}`,
        },
        {
          key: 'Members',
          value: `${detailInfo?.tierAccounts[3] || noLibraryText}`,
        },
        {
          key: 'Member Allocation',
          value: `${detailInfo?.tierAllocation[3] || noLibraryText}`,
        },
      ],
    },
    {
      title: 'Tier 4',
      data: [
        {
          key: 'Criteria',
          value: `${detailInfo?.tierCriteria[4] || noLibraryText} sTOS`,
        },
        {
          key: 'Allocation',
          value: `${detailInfo?.totalExpectSaleAmount[4] || noLibraryText}`,
        },
        {
          key: 'Members',
          value: `${detailInfo?.tierAccounts[4] || noLibraryText}`,
        },
        {
          key: 'Member Allocation',
          value: `${detailInfo?.tierAllocation[4] || noLibraryText}`,
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
          value: `${detailInfo?.tierCriteria[1] || noLibraryText} sTOS`,
        },
        {
          key: 'Allocation',
          value: `${detailInfo?.totalExpectSaleAmount[1] || noLibraryText}`,
        },
        {
          key: '#of Members',
          value: `${detailInfo?.tierOfMembers[1] || noLibraryText}`,
        },
        {
          key: '#of Whitelisted',
          value: `${detailInfo?.tierAccounts[1] || noLibraryText}`,
        },
        {
          key: 'Expected Allocation',
          value: `${detailInfo?.tierAllocation[1] || noLibraryText}`,
        },
      ],
    },
    {
      title: 'tier 2',
      data: [
        {
          key: 'Criteria',
          value: `${detailInfo?.tierCriteria[2] || noLibraryText} sTOS`,
        },
        {
          key: 'Allocation',
          value: `${detailInfo?.totalExpectSaleAmount[2] || noLibraryText}`,
        },
        {
          key: '#of Members',
          value: `${detailInfo?.tierOfMembers[2] || noLibraryText}`,
        },
        {
          key: '#of Whitelisted',
          value: `${detailInfo?.tierAccounts[2] || noLibraryText}`,
        },
        {
          key: 'Expected Allocation',
          value: `${detailInfo?.tierAllocation[2] || noLibraryText}`,
        },
      ],
    },
    {
      title: 'tier 3',
      data: [
        {
          key: 'Criteria',
          value: `${detailInfo?.tierCriteria[3] || noLibraryText} sTOS`,
        },
        {
          key: 'Allocation',
          value: `${detailInfo?.totalExpectSaleAmount[3] || noLibraryText}`,
        },
        {
          key: '#of Members',
          value: `${detailInfo?.tierOfMembers[3] || noLibraryText}`,
        },
        {
          key: '#of Whitelisted',
          value: `${detailInfo?.tierAccounts[3] || noLibraryText}`,
        },
        {
          key: 'Expected Allocation',
          value: `${detailInfo?.tierAllocation[3] || noLibraryText}`,
        },
      ],
    },
    {
      title: 'tier 4',
      data: [
        {
          key: 'Criteria',
          value: `${detailInfo?.tierCriteria[4] || noLibraryText} sTOS`,
        },
        {
          key: 'Allocation',
          value: `${detailInfo?.totalExpectSaleAmount[4] || noLibraryText}`,
        },
        {
          key: '#of Members',
          value: `${detailInfo?.tierOfMembers[4] || noLibraryText}`,
        },
        {
          key: '#of Whitelisted',
          value: `${detailInfo?.tierAccounts[4] || noLibraryText}`,
        },
        {
          key: 'Expected Allocation',
          value: `${detailInfo?.tierAllocation[4] || noLibraryText}`,
        },
      ],
    },
  ];

  return (
    <Flex flexDir="column">
      <Flex mb={'30px'} alignItems="center">
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 24})}>
          Tier details
        </Text>
        {library && (
          <>
            <Text ml={2}>Snapshot date</Text>
            <Text ml={1}>
              {convertTimeStamp(
                Number(detailInfo?.snapshot.toString()),
                'YYYY.MM.DD HH:mm',
              )}
            </Text>
          </>
        )}
      </Flex>
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
                  index + 1 === detailInfo?.userTier
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
                  index + 1 === detailInfo?.userTier
                }></DetailTableContainer>
            );
          })}
      </Box>
    </Flex>
  );
};
