import {Box, Container, Flex, Link, Text, useTheme} from '@chakra-ui/react';
import {useColorMode} from '@chakra-ui/react';
import {useRouteMatch} from 'react-router-dom';
export const MobileFooter = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const match = useRouteMatch('/');
  return (
    <Flex
      bg={
        match?.isExact
          ? colorMode === 'light'
            ? '#007aff'
            : '#222222'
          : 'transparent'
      }>
      <Flex
        flexDirection="column"
        h="72px"
        alignItems={'center'}
        justifyContent="space-between"
        fontFamily={theme.fonts.openSans}
        w="100%"
        py={'15px'}
        color={
          match?.isExact
            ? '#fff'
            : colorMode === 'light'
            ? '#3e495c'
            : '#ffffff'
        }>
        <Text fontSize="14px" fontWeight={600} h={'21px'}>
          Copyright © 2024{' '}
          <span style={{color: colorMode === 'light' ? '#ffffff' : '#fff'}}>
            Tokamak Network
          </span>{' '}
          All Rights Reserved.
        </Text>
        <Text
          fontSize="11px"
          color={colorMode === 'light' ? '#ffff07' : '#fff'}
          fontWeight={'normal'}>
          E. hello@tokamak.network
        </Text>
      </Flex>
    </Flex>
  );
};
