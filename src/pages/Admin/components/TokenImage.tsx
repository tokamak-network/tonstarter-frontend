import {Avatar, Flex, Text} from '@chakra-ui/react';
import React from 'react';

type TokenImageProps = {
  imageLink?: string;
};
export const TokenImage: React.FC<TokenImageProps> = (props) => {
  const {imageLink} = props;

  if (imageLink === '' || imageLink === undefined) {
    return (
      <Flex
        w={'50px'}
        h={'50px'}
        alignItems="center"
        justifyContent="center"
        border={'1px solid #c7d1d8'}
        borderRadius={25}
        fontSize={14}
        color={'#c7d1d8'}>
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
      border={'1px solid #c7d1d8'}
      borderRadius={25}
      h="50px"
      w="50px"
    />
  );
};
