import {Grid, Box} from '@chakra-ui/react';

export const ActiveProject = () => {
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={30}>
      <Box w={378}>1</Box>
      <Box w={378}>2</Box>
      <Box w={378}>3</Box>
      <Box w={378}>4</Box>
      <Box w={378}>5</Box>
    </Grid>
  );
};
