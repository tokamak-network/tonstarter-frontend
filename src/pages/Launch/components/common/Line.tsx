import {useColorMode} from '@chakra-ui/react';
import {Box} from 'rebass';

const Line = () => {
  const {colorMode} = useColorMode();
  return (
    <Box
      width={'100%'}
      height={'1px'}
      bg={colorMode === 'light' ? '#f4f6f8' : '#373737'}></Box>
  );
};

export default Line;
