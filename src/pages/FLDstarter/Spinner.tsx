import {useState} from 'react';
import {Box, Center, Spinner} from '@chakra-ui/react';

export const CustomSpinner = (prop: {loading: boolean}) => {
  const {loading} = prop;
  const [load] = useState(loading);
  if (load) {
    return (
      <Box
        display="flex"
        pos="absolute"
        justifyContent="center"
        w="100%"
        h="100%"
        alignSelf="center"
        zIndex={100}
        left="0"
        top="0"
        borderRadius={10}>
        <Center>
          <Spinner></Spinner>
        </Center>
      </Box>
    );
  }
  return <></>;
};
