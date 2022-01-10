import {Flex, Box} from '@chakra-ui/react';

type CircleType = {
  bg: string;
};

export const Circle = (props: CircleType) => {
  const {bg} = props;
  return (
    <Flex alignContent={'center'} alignItems={'center'} mr={0} ml={'16px'}>
      <Box w={'8px'} h={'8px'} borderRadius={50} bg={bg}></Box>
    </Flex>
  );
};
