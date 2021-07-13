import {Box, Text, Flex, Link} from '@chakra-ui/react';
import React, {useCallback} from 'react';
import {shortenAddress} from 'utils';
import store from 'store';

const getStatus = (
  type: 'sale' | 'start' | 'end',
  colorMode: 'light' | 'dark',
) => {
  return (
    <Flex alignContent={'center'} alignItems={'center'} mr={'20px'}>
      <Box
        w={'8px'}
        h={'8px'}
        borderRadius={50}
        bg={
          type === 'sale' ? '#f95359' : type === 'start' ? '#ffdc00' : '#2ea2f8'
        }
        mr={'7px'}
        mt={'2px'}></Box>
      <Text
        fontSize={'11px'}
        color={colorMode === 'light' ? '#304156' : 'white.100'}>
        {type === 'sale' ? 'On sale' : type === 'start' ? 'started' : 'ended'}
      </Text>
    </Flex>
  );
};

const getCircle = (type: 'loading' | 'sale' | 'start' | 'end') => {
  return (
    <Flex alignContent={'center'} alignItems={'center'} mr={0} ml={'16px'}>
      <Box
        w={'8px'}
        h={'8px'}
        borderRadius={50}
        bg={
          type === 'loading'
            ? '#C0C0C0'
            : type === 'sale'
            ? '#f95359'
            : type === 'start'
            ? '#ffdc00'
            : '#2ea2f8'
        }></Box>
    </Flex>
  );
};

export const RenderRowSub = ({props}: any) => {
  //   <Flex>
  //     {getStatus('sale', colorMode)}
  //     {getStatus('start', colorMode)}
  //     {getStatus('end', colorMode)}
  //   </Flex>;
  return <Flex>sub</Flex>;
};
