import {Tab} from '../types/index';
import {Box, Text, Flex, useColorMode} from '@chakra-ui/react';
import {CustomTitle} from 'components/Basic/CustomTitle';

type ModalTabsProp = {
  tab: Tab;
  TOS_PER_HOUR: string;
  TOS_EARNED: string;
  TOS_FEE: string;
  WTOS_FEE: string;
  TOS_CLAIM: string;
};

export const ModalTabs = (prop: ModalTabsProp) => {
  const {tab, TOS_PER_HOUR, TOS_EARNED, TOS_FEE, WTOS_FEE, TOS_CLAIM} = prop;
  const {colorMode} = useColorMode();
  const fontColorGray = colorMode === 'light' ? 'gray.250' : 'white.100';
  const fontColorBlack = colorMode === 'light' ? 'black.300' : 'white.100';

  if (tab === 'Reward') {
    return (
      <Flex flexDir="column" alignItems="center">
        {/* <Box mb={'18px'}>
          <CustomTitle
            title={'Claim TOS reward'}
            fontSize={'13px'}></CustomTitle>
        </Box> */}
        <Box d="flex" mb={'24px'}>
          <Text
            h={'40px'}
            mr={'5px'}
            fontSize={'32px'}
            fontWeight={600}
            color={fontColorBlack}>
            {TOS_CLAIM}
          </Text>
          <Text
            fontSize={'13px'}
            fontWeight={600}
            color={fontColorGray}
            alignSelf="flex-end">
            TOS
          </Text>
        </Box>
        {/* <Box d="flex" flexDir={'column'} alignItems="center" mb={'18px'}>
          <CustomTitle
            title={'Detail'}
            fontSize={'12px'}
            subTitle={true}></CustomTitle>
          <Box d="flex" fontSize={13} color={fontColorGray}>
            <Text mr={2}>Earning per Hour</Text>
            <Text>{TOS_PER_HOUR}</Text>
            <Text fontSize={11} alignSelf="flex-end">
              TOS/$
            </Text>
          </Box>
          <Box d="flex" fontSize={13} color={fontColorGray}>
            <Text mr={2}>TOS earned</Text>
            <Text>{TOS_EARNED}</Text>
            <Text fontSize={11} alignSelf="flex-end">
              TOS
            </Text>
          </Box>
        </Box> */}
      </Flex>
    );
  }
  if (tab === 'Fee') {
    return (
      <Flex>
        <Box d="flex" flexDir="column" alignItems="center" mb={'20px'}>
          <Box mb={'18px'}>
            <CustomTitle title={'Claim fee'} fontSize={'13px'}></CustomTitle>
          </Box>
          <Box d="flex" mb={'10px'}>
            <Text
              h={'40px'}
              mr={'5px'}
              fontSize={'32px'}
              fontWeight={600}
              color={fontColorBlack}>
              {TOS_FEE}
            </Text>
            <Text
              fontSize={'13px'}
              fontWeight={600}
              color={fontColorGray}
              alignSelf="flex-end">
              TOS
            </Text>
          </Box>
          <Box d="flex">
            <Text
              h={'40px'}
              mr={'5px'}
              fontSize={'32px'}
              fontWeight={600}
              color={fontColorBlack}>
              {WTOS_FEE}
            </Text>
            <Text
              fontSize={'13px'}
              fontWeight={600}
              color={fontColorGray}
              alignSelf="flex-end">
              WTOS
            </Text>
          </Box>
        </Box>
      </Flex>
    );
  }
  return (
    <Flex flexDir="column" alignItems="center">
      <Box mb={'18px'}>
        {/* <CustomTitle title={'Claim TOS reward'} fontSize={'13px'}></CustomTitle> */}
      </Box>
      <Box d="flex" mb={'24px'}>
        <Text
          h={'40px'}
          mr={'5px'}
          fontSize={'32px'}
          fontWeight={600}
          color={fontColorBlack}>
          {TOS_CLAIM}
        </Text>
        <Text
          fontSize={'13px'}
          fontWeight={600}
          color={fontColorGray}
          alignSelf="flex-end">
          TOS
        </Text>
      </Box>
      {/* <Box d="flex" flexDir={'column'} alignItems="center" mb={'18px'}>
        <CustomTitle
          title={'Detail'}
          fontSize={'12px'}
          subTitle={true}></CustomTitle>
        <Box d="flex" fontSize={13} color={fontColorGray}>
          <Text mr={2}>Earning per Hour</Text>
          <Text mr={'2px'}>{TOS_PER_HOUR}</Text>
          <Text fontSize={11} alignSelf="flex-end">
            TOS/$
          </Text>
        </Box>
        <Box d="flex" fontSize={13} color={fontColorGray}>
          <Text mr={2}>TOS earned</Text>
          <Text mr={'2px'}>{TOS_EARNED}</Text>
          <Text fontSize={11} alignSelf="flex-end">
            TOS
          </Text>
        </Box>
      </Box>
      <Box d="flex" flexDir="column" alignItems="center" mb={'20px'}>
        <Box mb={'18px'}>
          <CustomTitle title={'Claim fee'} fontSize={'13px'}></CustomTitle>
        </Box>
        <Box d="flex" mb={'10px'}>
          <Text
            h={'40px'}
            mr={'5px'}
            fontSize={'32px'}
            fontWeight={600}
            color={fontColorBlack}>
            {TOS_FEE}
          </Text>
          <Text
            fontSize={'13px'}
            fontWeight={600}
            color={fontColorGray}
            alignSelf="flex-end">
            TOS
          </Text>
        </Box>
        <Box d="flex">
          <Text
            h={'40px'}
            mr={'5px'}
            fontSize={'32px'}
            fontWeight={600}
            color={fontColorBlack}>
            {WTOS_FEE}
          </Text>
          <Text
            fontSize={'13px'}
            fontWeight={600}
            color={fontColorGray}
            alignSelf="flex-end">
            WTOS
          </Text>
        </Box>
      </Box> */}
    </Flex>
  );
};
