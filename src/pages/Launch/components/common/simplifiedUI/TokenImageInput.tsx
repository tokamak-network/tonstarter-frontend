import {Avatar, Flex, Text, useColorMode} from '@chakra-ui/react';
import React from 'react';

type TokenImageProps = {
  imageLink?: string;
};
export const TokenImageInput: React.FC<TokenImageProps> = (props) => {
  const {imageLink} = props;
  const {colorMode} = useColorMode();

  if (imageLink === '' || imageLink === undefined) {
    return (
      <Flex
        w={'80px'}
        h={'80px'}
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        border={
          colorMode === 'light' ? '1px solid #f4f6f8;' : 'solid 1px #323232'
        }
        borderRadius={40}
        fontSize={13}
        px="22px" 
        py="24px"
        fontWeight={500}
        color={colorMode === 'light' ? 'gray.625' : 'gray.600'}>
        <Text>Token Image</Text>
      </Flex>
    );
  }
  return (
    <Avatar
      src={imageLink}
      backgroundColor={'transparent'}
      bg="transparent"
      color="#c7d1d8"
      textAlign="center"
      name={'token_image'}
      border={colorMode === 'light' ? '1px solid #c7d1d8' : ''}
      borderRadius={40}
      h="80px"
      w="80px"
    />
  );
};
