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
        fontFamily={'TitilliumWeb'}
        w="100%"
        py={'15px'}
        color={
          match?.isExact
            ? '#fff'
            : colorMode === 'light'
            ? '#3e495c'
            : '#999999'
        }>
        <Text
          fontSize="14px"
          fontWeight={600}
          h={'21px'}
          color={colorMode === 'light' ? '#fff' : '#999999'}>
          © 2024{' '}
          <span style={{color: colorMode === 'light' ? '#ffffff' : '#fff'}}>
            Tokamak Network
          </span>{' '}
        </Text>
        <Text
          fontSize="11px"
          h={'15px'}
          color={colorMode === 'light' ? '#ffff07' : '#9d9ea5'}
          fontWeight={'normal'}>
          E. hello@tokamak.network
        </Text>
      </Flex>
    </Flex>
  );
};
