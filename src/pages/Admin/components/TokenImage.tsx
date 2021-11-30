import {Avatar, Flex, Text, useColorMode} from '@chakra-ui/react';
import React from 'react';

type TokenImageProps = {
  imageLink?: string;
};
export const TokenImage: React.FC<TokenImageProps> = (props) => {
  const {imageLink} = props;
  const {colorMode} = useColorMode();

  if (imageLink === '' || imageLink === undefined) {
    return (
      <Flex
        w={'50px'}
        h={'50px'}
        alignItems="center"
        justifyContent="center"
        border={
          colorMode === 'light' ? '1px solid #c7d1d8' : 'solid 1px #323232'
        }
        borderRadius={25}
        fontSize={14}
        color={colorMode === 'light' ? 'gray.625' : 'gray.600'}>
        <Text>Image</Text>
      </Flex>
    );
  }
  return (
    <Avatar
      src={imageLink}
      backgroundColor={'transparent'}
      bg="transparent"
      color="#c7d1d8"
      name={'token_image'}
      border={colorMode === 'light' ? '1px solid #c7d1d8' : ''}
      borderRadius={25}
      h="50px"
      w="50px"
    />
  );
};
